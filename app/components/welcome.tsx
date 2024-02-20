import { useEffect } from "react";
import Warp from "warpjs";

export default function Welcome() {
  useEffect(() => {
    const svg = document.getElementById("svg-element");
    const warp = new Warp(svg!);

    warp.interpolate(4);
    warp.transform(([x, y]) => [x, y, y]);

    let offset = 0;
    function animate() {
      warp.transform(([x, _y, oy]) => [
        x,
        oy + 4 * Math.sin(x / 16 + offset),
        oy,
      ]);
      offset += 0.1;
      requestAnimationFrame(animate);
    }

    animate();
  }, []);
  return (
    <section id="welcome">
      <div className="content">
        <h1>Blake Netzeband</h1>
        <h2>Full Stack Developer</h2>
        <svg id="svg-element" viewBox="0 0 303 251">
          <circle cx="88.784" cy="141.382" r="88.784" />
          <path
            id="path1"
            d="M278.078,26.195l-161.04,-26.195l-26.195,161.04l161.04,26.195l26.195,-161.04Z"
          />
          <path
            id="path2"
            d="M170.608,63.772l131.392,155.722l-213.216,30.874l81.824,-186.596Z"
          />
        </svg>
      </div>
    </section>
  );
}
