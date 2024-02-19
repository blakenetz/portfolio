import { useEffect } from "react";

export default function Welcome() {
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const spansSlow = document.querySelectorAll<HTMLElement>(".spanSlow");
    const spansFast = document.querySelectorAll<HTMLElement>(".spanFast");

    let width = window.innerWidth;

    function handleMouseMove(e: MouseEvent) {
      const normalizedPosition = e.pageX / (width / 2) - 1;
      const speedSlow = 100 * normalizedPosition;
      const speedFast = 200 * normalizedPosition;
      spansSlow.forEach((span) => {
        span.style.transform = `translate(${speedSlow}px)`;
      });
      spansFast.forEach((span) => {
        span.style.transform = `translate(${speedFast}px)`;
      });
    }
    function handleResize() {
      width = window.innerWidth;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="welcome">
      <section className="line">
        <div className="left">
          <div className="content">
            <span className="spanSlow">Blake Netzeband</span>
          </div>
        </div>

        <div className="right">
          <div className="content">
            <span className="spanSlow">Blake Netzeband</span>
          </div>
        </div>
      </section>

      <section className="line">
        <div className="left">
          <div className="content">
            <span className="spanFast">Full Stack Developer</span>
          </div>
        </div>
        <div className="right">
          <div className="content">
            <span className="spanFast">Full Stack Developer</span>
          </div>
        </div>
      </section>
    </section>
  );
}
