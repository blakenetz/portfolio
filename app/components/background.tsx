import { HTMLAttributes, PropsWithChildren } from "react";

import Header from "~/components/header";
import Links from "~/components/links";
import styles from "~/styles/background.module.css";

interface BackgroundProps extends HTMLAttributes<HTMLElement> {
  /**
   * Additional content is shown for index page
   */
  index?: boolean;
}

export default function Background({
  children,
  index,
  ...props
}: PropsWithChildren<BackgroundProps>) {
  return (
    <section
      {...props}
      className={[props.className, styles.background, props.className]
        .join(" ")
        .trim()}
    >
      <div className={[styles.main, index ? styles.mix : null].join(" ")}>
        <div className={styles.center}>
          {index && <Header />}
          {children}
          {index && <Links />}
        </div>
      </div>
    </section>
  );
}
