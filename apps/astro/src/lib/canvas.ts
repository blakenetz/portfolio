import Konva from "konva";

import { black, colors, getCssVariable, spacing, white } from "./styles";
import bike from "~/assets/bike.svg";
import dogCosmos from "~/assets/dog-cosmos.svg";
import pizzaSlice from "~/assets/pizza-slice.svg";
import van from "~/assets/van.svg";
import plant from "~/assets/plant.svg";
import sunflower from "~/assets/sunflower.svg";
import cactus from "~/assets/cactus.svg";
import flower from "~/assets/flower.svg";
import coffee from "~/assets/coffee.svg";
import hotDog from "~/assets/hot-dog.svg";
import smileyFace from "~/assets/smiley-face.svg";

import stereo from "~/assets/stereo.svg";
import thunderBolt from "~/assets/thunder-bolt.svg";

import { ANIMATE_COLORS_CLASSNAME } from "~/consts";
import type { CheckerboardSpace, Blob } from "~/types/canvas";

const icons = [
  bike,
  dogCosmos,
  pizzaSlice,
  van,
  plant,
  sunflower,
  cactus,
  flower,
  coffee,
  hotDog,
  smileyFace,
  stereo,
  thunderBolt,
].map(({ src }) => src);

function generateRandomPoints(index: number) {
  const length = 8;
  const radius = 100 * Math.pow(1.5, index + 0.25);
  const variance = radius * 0.3;

  return Array.from({ length }, (_, i) => {
    const angle = (i * 2 * Math.PI) / length;
    const r = radius + (Math.random() - 0.5) * variance;
    return [Math.cos(angle) * r, Math.sin(angle) * r];
  }).flat();
}

function getGradientStops(index: number) {
  const color = colors[index % colors.length]!;

  return [
    0,
    getCssVariable(`--color-${color}-200`),
    1,
    getCssVariable(`--color-${color}-500`),
  ];
}

class BaseCanvas {
  abortController: AbortController;
  stage: Konva.Stage;
  layer: Konva.Layer;

  constructor(target: string) {
    this.abortController = new AbortController();
    this.stage = new Konva.Stage({
      container: target,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  // Pythagorean theorem to get the diagonal distance of the screen
  getMaxWidth() {
    return Math.sqrt(
      Math.pow(this.stage.width(), 2) + Math.pow(this.stage.height(), 2),
    );
  }

  getDefaultBlobProperties(): Konva.LineConfig & Konva.Vector2d {
    const x = this.stage.width() * 0.66;
    const y = this.stage.height() * 0.33;

    return {
      x,
      y,
      strokeWidth: this.getMaxWidth() / 100,
      stroke: white,
      closed: true,
      tension: 0.3,
    };
  }

  initializeEventListeners(
    listeners: Partial<{
      resize: (e: Event) => void;
      mousemove: (e: MouseEvent, pos: Konva.Vector2d) => void;
      mouseenter: (e: MouseEvent, el: HTMLElement) => void;
      mouseleave: (e: MouseEvent, el: HTMLElement) => void;
    }>,
  ) {
    window.addEventListener("unload", () => this.abortController.abort());

    /**
     * adjust stage dimensions
     */
    window.addEventListener(
      "resize",
      (e) => {
        this.stage.width(window.innerWidth);
        this.stage.height(window.innerHeight);
        this.stage.draw();
        listeners.resize?.(e);
      },
      { signal: this.abortController.signal },
    );

    /**
     * move blobs to mouse position
     */
    window.addEventListener(
      "mousemove",
      (e) => {
        this.stage.setPointersPositions(e);
        const pos = this.stage.getPointerPosition();
        if (!pos) return;

        listeners.mousemove?.(e, pos);
      },
      { signal: this.abortController.signal },
    );

    /**
     * trigger colorization animation
     * @see {@link file://./../pages/index.astro}
     */
    document
      .querySelectorAll<HTMLElement>(`.${ANIMATE_COLORS_CLASSNAME}`)
      .forEach((el) => {
        el.addEventListener(
          "mouseenter",
          (e) => listeners.mouseenter?.(e, el),
          { signal: this.abortController.signal },
        );
        el.addEventListener(
          "mouseleave",
          (e) => listeners.mouseleave?.(e, el),
          { signal: this.abortController.signal },
        );
      });
  }
}

export class CursorCanvas extends BaseCanvas {
  cursor: Konva.Line;

  constructor(target: string) {
    super(target);
    this.cursor = this.generateCursor();
    this.initializeEventListeners({
      mousemove: (_e, pos) => {
        this.cursor.to({
          x: pos.x,
          y: pos.y,
          duration: 0,
          easing: Konva.Easings.EaseIn,
        });
      },
      mouseenter: () => this.cursor.setAttrs({ stroke: white }),
      mouseleave: () => this.cursor.setAttrs({ stroke: black }),
    });
  }

  private generateCursor() {
    const defaults = this.getDefaultBlobProperties();
    const node = new Konva.Line({
      ...defaults,
      points: generateRandomPoints(0),
      stroke: black,
      fillRadialGradientEndRadius: 20,
      fillRadialGradientColorStops: [0, black, 1, "transparent"],
      scale: { x: 0.1, y: 0.1 },
    });

    this.layer.add(node);

    return node;
  }
}

export class BlobBackgroundCanvas extends BaseCanvas {
  blobs: Blob[];

  constructor(target: string) {
    super(target);
    // create content for layers
    this.blobs = this.generateBlobs();
    this.initializeBlobAnimations();

    this.initializeEventListeners({
      mousemove: (_e, pos) => {
        this.blobs.forEach(({ tween }, i) => {
          tween.node.to({
            x: pos.x,
            y: pos.y,
            duration: 0.1 + i * 0.1,
            easing: Konva.Easings.Linear,
          });
        });
      },
      mouseenter: (_e, el) => {
        el.style.color = black;
        this.blobs.forEach(({ node }, index) => {
          node.setAttrs({
            fillLinearGradientColorStops: getGradientStops(index),
          });
        });
      },
      mouseleave: (_e, el) => {
        el.style.color = "";
        this.blobs.forEach(({ node }) => {
          node.setAttrs({ fillLinearGradientColorStops: [] });
        });
      },
    });
  }

  /**
   * Generate blob nodes until node radius is greater than maxWidth
   */
  private generateBlobNodes() {
    const blobNodes: Konva.Line[] = [];
    const defaults = this.getDefaultBlobProperties();

    // at most, create 20 blobs
    for (let i = 0; i < 20; i++) {
      const node = new Konva.Line({
        ...defaults,
        points: generateRandomPoints(i),
        fillLinearGradientColorStops: [],
        fillLinearGradientStartPoint: {
          x: defaults.x * -1,
          y: defaults.y * -1,
        },
        fillLinearGradientEndPoint: {
          x: defaults.x,
          y: defaults.y,
        },
      });

      blobNodes.push(node);

      // break when blob extends past the screen
      if (node.width() / 2 > this.getMaxWidth()) {
        break;
      }
    }

    return blobNodes;
  }

  /**
   * Add blobs to layer and group in reverse order
   * Rotate each blob to randomize gradient direction
   * Create tween for each blob in original order
   */
  private generateBlobs() {
    return this.generateBlobNodes()
      .toReversed()
      .map((node) => {
        node.rotation(Math.random() * 360);
        this.layer.add(node);
        return node;
      })
      .reverse()
      .map((node) => ({ node, tween: new Konva.Tween({ node }) }));
  }

  private initializeBlobAnimations() {
    const animation = new Konva.Animation((frame) => {
      if (!frame) return;
      this.blobs.forEach(({ node }) => {
        node.skewX(Math.sin(frame.time / 1000) * 0.1);
      });
    });
    animation.start();
  }
}

export class CheckerboardBackgroundCanvas extends BaseCanvas {
  constructor(target: string) {
    super(target);

    // create content for layers
    this.drawCheckerboard();
    this.initializeEventListeners({
      resize: () => {
        this.destroyCheckerboard();
        this.drawCheckerboard();
      },
    });
  }

  private getDefaultCheckerboardProperties(): Konva.ShapeConfig & {
    name: string;
  } {
    return {
      name: "checkerboard",
      width: spacing,
      height: spacing,
      fill: white,
    };
  }

  /**
   * Draw checkerboard border
   * by determining the number of rows and columns that can fit in the screen
   * and then drawing rectangles in alternating colors
   * Then, place assets in random blank spaces
   */
  private drawCheckerboard() {
    const cols = Math.ceil(this.stage.width() / spacing);
    const rows = Math.ceil(this.stage.height() / spacing);
    const blankSpaces: CheckerboardSpace[] = [];
    const defaults = this.getDefaultCheckerboardProperties();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isOnBorder =
          row < 2 || // top border
          row > rows - 3.1 || // bottom border given an extra 1.1 threshold
          col < 2 || // left border
          col > cols - 3.1; // right border given an extra 1.1 threshold

        if (!isOnBorder) continue;

        // track blank spaces
        if ((row + col) % 2 === 1) {
          blankSpaces.push({ x: col, y: row });
          continue;
        }

        // draw checkerboard space
        const rect = new Konva.Rect({
          ...defaults,
          x: col * spacing,
          y: row * spacing,
        });
        this.layer.add(rect);
      }
    }

    this.placeIcons(blankSpaces);
  }

  private placeIcons(blankSpaces: CheckerboardSpace[]) {
    const defaults = this.getDefaultCheckerboardProperties();

    // place icons and random shapes
    [...icons, Array.from({ length: 8 })].forEach((el, i) => {
      const randomIndex = Math.floor(Math.random() * blankSpaces.length);
      const space = blankSpaces[randomIndex];
      if (!space) return; // if space doesn't exist, skip adding svg

      if (typeof el === "string") {
        Konva.Image.fromURL(el, (node) => {
          this.layer.add(node);
          node.setAttrs({
            ...defaults,
            x: space.x * spacing,
            y: space.y * spacing,
            fill: "transparent",
          });
        });
      } else {
        const x = space.x * spacing + spacing / 2;
        const y = space.y * spacing + spacing / 2;

        const shape =
          i % 2 === 0
            ? new Konva.Circle({ ...defaults, x, y })
            : new Konva.Arc({
                ...defaults,
                x,
                y,
                innerRadius: 0,
                outerRadius: spacing / 2,
                angle: 180,
                rotation: Math.floor(Math.random() * 4) * 90,
              });

        this.layer.add(shape);
      }

      // remove space from blankSpaces
      blankSpaces.splice(randomIndex, 1);
    });
  }

  private destroyCheckerboard() {
    const { name } = this.getDefaultCheckerboardProperties();

    this.layer
      .getChildren((node) => node.name() === name)
      .forEach((node) => node.destroy());
  }
}
