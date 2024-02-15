import paper from "paper";
import { useRef, useEffect } from "react";

function paperInit(el: HTMLCanvasElement) {
  paper.setup(el);

  let scaleFactor = 1;
  let positionX = 0;
  let positionY = 0;

  function setScale(faceWidth: number) {
    scaleFactor = window.innerWidth / 5 / faceWidth;
  }

  function setPosition() {
    positionX = window.innerWidth / 7;
    positionY = window.innerHeight / 4;
  }

  // GLASSES
  const leftGlass = new paper.Path.Circle({
    center: [100, 150],
    radius: 50,
  });
  const rightGlass = leftGlass.clone();
  rightGlass.position.x += rightGlass.bounds.width * 1.5;
  const bridge = new paper.Path.Arc({
    from: [leftGlass.bounds.rightCenter.x, leftGlass.bounds.rightCenter.y],
    through: [
      leftGlass.bounds.rightCenter.x * 1.33,
      leftGlass.bounds.rightCenter.y * 0.99,
    ],
    to: [rightGlass.bounds.leftCenter.x, rightGlass.bounds.leftCenter.y],
  });
  const glasses = new paper.Group({
    children: [rightGlass, bridge, leftGlass],
    strokeColor: "#303a49",
    strokeWidth: 5,
  });

  // EYES
  const leftEye = leftGlass.clone();
  leftEye.scale(0.5);
  const rightEye = rightGlass.clone();
  rightEye.scale(0.5);
  const eyes = new paper.Group({
    children: [rightEye, leftEye],
    strokeColor: "white",
    strokeWidth: 20,
    fillColor: "#507E84",
  });

  // NOSE
  const nose = new paper.Path({
    strokeColor: "#FFFFFF",
    strokeWidth: 3.5,
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

  console.log(
    glasses.bounds.center.x,
    glasses.bounds.center.y + glasses.bounds.height / 3
  );
  // HEAD
  const head = new paper.Path.RegularPolygon({
    center: [
      glasses.bounds.center.x,
      glasses.bounds.center.y + glasses.bounds.height / 3,
    ],
    sides: 25,
    radius: glasses.bounds.width / 2.2,
    fillColor: "#8AFEE1",
  });
  head.scale(scaleFactor, scaleFactor);

  // FACE - GROUP ALL ITEMS
  const face = new paper.Group({
    children: [head, nose, eyes, glasses],
  });
  setPosition();
  face.position = new paper.Point(positionX, positionY);
  setScale(face.bounds.width);
  // face.scale(scaleFactor, scaleFactor);

  // ANIMATE
  paper.view.onFrame = (e) => {
    if (e.count % 2 !== 0) return;
    // eyes
    eyes.children.forEach((eye) => {
      eye.segments.forEach((segment) => {
        segment.point.x += Math.random() * 1 - 0.5;
      });
      eye.rotate(0.1);
    });
    // head
    head.segments.forEach((segment) => {
      segment.point.x += Math.random() * 10 - 5;
    });
    if (e.count % 20 === 0) head.smooth();
  };
  // ON RESIZE
  paper.view.onResize = () => {
    setPosition();
    face.position = new paper.Point(positionX, positionY);

    setScale(face.bounds.width);
    face.scale(scaleFactor, scaleFactor);
  };
}

export default function Welcome() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    paperInit(ref.current);
  }, []);

  return (
    <section className="welcome">
      <canvas ref={ref} data-paper-resize="true" />
      <div className="welcome-text">
        <h1>Blake Netzeband</h1>
        <h2>Web Developer</h2>
      </div>
    </section>
  );
}
