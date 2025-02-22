import Konva from "konva";

import { black, colors, getCssVariable, spacing, white } from "./styles";
import bicycle from "~/assets/bicycle.svg";
import dogCosmos from "~/assets/dog-cosmos.svg";
import pizzaSlice from "~/assets/pizza-slice.svg";
import pizza from "~/assets/pizza.svg";
import van from "~/assets/van.svg";
import { ANIMATE_COLORS_CLASSNAME } from "~/consts";

type CheckerboardSpace = Konva.Vector2d;
type Blob = { node: Konva.Line; tween: Konva.Tween };

const icons: HTMLImageElement[] = [
  bicycle,
  dogCosmos,
  pizzaSlice,
  pizza,
  van,
].map((src) => {
  const img = new Image();
  img.src = src.src;
  return img;
});

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
  const start = colors[index % colors.length]!;
  const end = colors[(index + 1) % colors.length]!;

  return [
    0,
    getCssVariable(`--color-${start}-400`),
    1,
    getCssVariable(`--color-${end}-400`),
  ];
}

export class BackgroundCanvas {
  abortController: AbortController;
  stage: Konva.Stage;
  blobLayer: Konva.Layer;
  checkerboardLayer: Konva.Layer;
  blobs: Blob[];

  constructor() {
    this.abortController = new AbortController();
    this.stage = new Konva.Stage({
      container: "background",
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.blobLayer = new Konva.Layer();
    this.checkerboardLayer = new Konva.Layer();
    this.stage.add(this.blobLayer);
    this.stage.add(this.checkerboardLayer);
    this.blobs = this.generateBlobs();
    this.initializeBlobAnimations();
    this.drawCheckerboard();
  }

  // Pythagorean theorem to get the diagonal distance of the screen
  private getMaxWidth() {
    return Math.sqrt(
      Math.pow(this.stage.width(), 2) + Math.pow(this.stage.height(), 2),
    );
  }

  /**
   * Generate blob nodes until node radius is greater than maxWidth
   */
  private generateBlobNodes() {
    const blobNodes: Konva.Line[] = [];
    const x = this.stage.width() * 0.66;
    const y = this.stage.height() * 0.33;
    const maxWidth = this.getMaxWidth();

    // at most, create 20 blobs
    for (let i = 0; i < 20; i++) {
      const node = new Konva.Line({
        points: generateRandomPoints(i),
        fillLinearGradientColorStops: [],
        fillLinearGradientStartPoint: { x: x * -1, y: y * -1 },
        fillLinearGradientEndPoint: { x, y },
        stroke: white,
        strokeWidth: maxWidth / 100,
        closed: true,
        tension: 0.3,
        x,
        y,
      });

      blobNodes.push(node);

      // break when blob extends past the screen
      if (node.width() / 2 > maxWidth) {
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
        this.blobLayer.add(node);
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

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const isOnBorder =
          i < 2 || // top border
          i > rows - 3.1 || // bottom border
          j < 2 || // left border
          j > cols - 3.1; // right border

        if (isOnBorder) {
          if ((i + j) % 2 === 1) {
            blankSpaces.push({ x: j, y: i });
          } else {
            const rect = new Konva.Rect({
              x: j * spacing,
              y: i * spacing,
              width: spacing,
              height: spacing,
              fill: white,
            });
            this.checkerboardLayer.add(rect);
          }
        }
      }
    }

    this.placeIcons(blankSpaces);
  }

  private placeIcons(blankSpaces: CheckerboardSpace[]) {
    icons.forEach((img) => {
      const randomIndex = Math.floor(Math.random() * blankSpaces.length);
      const space = blankSpaces.splice(randomIndex, 1)[0];
      if (!space) return;

      const image = new Konva.Image({
        x: space.x * spacing,
        y: space.y * spacing,
        width: spacing,
        height: spacing,
        image: img,
      });

      this.checkerboardLayer.add(image);
    });
  }

  initializeEventListeners() {
    window.addEventListener("unload", () => this.abortController.abort());

    /**
     * adjust stage dimensions
     * Redraw checkerboard
     */
    window.addEventListener(
      "resize",
      () => {
        console.log("resized");
        this.stage.width(window.innerWidth);
        this.stage.height(window.innerHeight);
        this.stage.draw();
        this.checkerboardLayer.destroyChildren();
        this.drawCheckerboard();
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

        this.blobs.forEach(({ tween }, i) => {
          tween.node.to({
            x: pos.x,
            y: pos.y,
            duration: 0.1 + i * 0.1,
            easing: Konva.Easings.Linear,
          });
        });
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
          () => {
            el.style.color = black;
            this.blobs.forEach(({ node }, index) => {
              node.setAttrs({
                fillLinearGradientColorStops: getGradientStops(index),
              });
            });
          },
          {
            signal: this.abortController.signal,
          },
        );
        el.addEventListener(
          "mouseleave",
          () => {
            el.style.color = "";
            this.blobs.forEach(({ node }) => {
              node.setAttrs({ fillLinearGradientColorStops: [] });
            });
          },
          {
            signal: this.abortController.signal,
          },
        );
      });
  }
}
