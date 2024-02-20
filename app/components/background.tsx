import "~/styles/background.css";

import { HTMLAttributes, PropsWithChildren } from "react";

export default function Welcome({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section id="background" {...props}>
      <div className="main">{children}</div>
    </section>
  );
}
