import { HTMLAttributes, PropsWithChildren } from "react";

import Header from "~/components/header";
import Links from "~/components/links";
import styles from "~/styles/layout.module.css";

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
        {index ? (
          <div className={styles.center}>
            <Header />
            {children}
            <Links />
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
