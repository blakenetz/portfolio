<template>
  <section class="welcome">
    <canvas id="paper-canvas-welcome" resize="true"></canvas>
    <div class="welcome-text">
      <h1>Blake Netzeband</h1>
      <h2>Web Developer</h2>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import paper from 'paper'


type OnFrameEvent = {
  count: number;
  time: number;
  delta: number;
};

export default defineComponent({
  name: "WelcomeSection",
  props: {
    scope: { type: paper.PaperScope, required: true }
  },
  data() {
    return {
      scaleFactor: 1,
      positionX: 0,
      positionY: 0,
    };
  },

  mounted() {
    this.scope.setup('paper-canvas-welcome')
    // GLASSES
    const leftGlass = new this.scope.Path.Circle({
      center: [100, 150],
      radius: 50,
    });
    const rightGlass = leftGlass.clone();
    rightGlass.position.x += rightGlass.bounds.width * 1.5;
    const bridge = new this.scope.Path.Arc({
      from: [leftGlass.bounds.rightCenter.x, leftGlass.bounds.rightCenter.y],
      through: [
        leftGlass.bounds.rightCenter.x * 1.33,
        leftGlass.bounds.rightCenter.y * 0.99,
      ],
      to: [rightGlass.bounds.leftCenter.x, rightGlass.bounds.leftCenter.y],
    });
    const glasses = new this.scope.Group({
      children: [rightGlass, bridge, leftGlass],
      strokeColor: "#303a49",
      strokeWidth: 10,
    });

    // EYES
    const leftEye = leftGlass.clone();
    leftEye.scale(0.5);
    const rightEye = rightGlass.clone();
    rightEye.scale(0.5);
    const eyes = new this.scope.Group({
      children: [rightEye, leftEye],
      strokeColor: "white",
      strokeWidth: 20,
      fillColor: "#507E84",
    });

    // NOSE
    const nose = new this.scope.Path({
      strokeColor: "#FFFFFF",
      strokeWidth: 7,
    });
    nose.add(
      {
        // top of nose
        x: leftGlass.bounds.rightCenter.x,
        y: leftGlass.bounds.rightCenter.y - leftGlass.bounds.height,
      },
      {
        // tip of nose
        x: rightGlass.bounds.leftCenter.x,
        y: rightGlass.bounds.leftCenter.y + rightGlass.bounds.height,
      },
      {
        // nostril
        x: leftGlass.bounds.leftCenter.x + leftGlass.bounds.width / 2,
        y: rightGlass.bounds.leftCenter.y + leftGlass.bounds.height,
      }
    );

    // HEAD
    const head = new this.scope.Path.RegularPolygon({
      center: [
        glasses.bounds.center.x,
        glasses.bounds.center.y + glasses.bounds.height / 3,
      ],
      sides: 25,
      radius: glasses.bounds.width / 2.2,
      fillColor: "#8AFEE1",
    });
    head.scale(1.05, 1.35);

    // FACE - GROUP ALL ITEMS
    const face = new this.scope.Group({
      children: [head, nose, eyes, glasses],
    });
    this.setPosition();
    face.position = new this.scope.Point(this.positionX, this.positionY);
    this.setScale(face.bounds.width);
    face.scale(this.scaleFactor, this.scaleFactor);

    // ANIMATE
    this.scope.view.onFrame = (e: OnFrameEvent) => {
      // eyes
      for (let i = eyes.children.length - 1; i >= 0; i--) {
        const { segments } = eyes.children[i] as paper.Path;

        for (let j = segments.length - 1; j >= 0; j--) {
          segments[j].point.x += Math.random() * 1 - 0.5;
        }
        eyes.children[i].rotate(0.1);
      }
      // head
      for (let i = head.segments.length - 1; i >= 0; i--) {
        head.segments[i].point.x += Math.random() * 10 - 5;
      }
      if (e.count % 20 === 0) head.smooth();
    };
    // ON RESIZE
    this.scope.view.onResize = () => {
      this.setPosition();
      face.position = new this.scope.Point(this.positionX, this.positionY);

      this.setScale(face.bounds.width);
      face.scale(this.scaleFactor, this.scaleFactor);
    };
  },

  methods: {
    setScale: function (faceWidth: number) {
      this.scaleFactor = window.innerWidth / 2.5 / faceWidth;
    },
    setPosition: function () {
      this.positionX = window.innerWidth / 3.5;
      this.positionY = window.innerHeight / 2;
    },
  },
});
</script>
<style src="../assets/stylesheets/welcome.css" scoped></style>
