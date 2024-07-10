import { Title } from "@mantine/core";

import styles from "~/styles/layout.module.css";
import { cls } from "~/util";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Apply `mix-blend-mode: screen;` to extra parent div
   * @default false
   */
  burn?: boolean;
}

export default function Header({ burn, ...rest }: HeaderProps) {
  const content = (
    <div
      {...rest}
      className={cls(styles.content, styles.column, rest.className)}
    >
      <Title order={4} component="h1">
        Blake Netzeband
      </Title>
      <Title order={4} component="h2">
        Full Stack Developer
      </Title>
    </div>
  );

  return burn ? <div className="burn">{content}</div> : content;
}
