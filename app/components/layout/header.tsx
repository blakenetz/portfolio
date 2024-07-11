import { Title } from "@mantine/core";

import styles from "~/styles/common.module.css";
import { cls } from "~/util";

export default function Header(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      {...props}
      className={cls(
        styles.column,
        styles.burn,
        styles.content,
        props.className
      )}
    >
      <Title order={4} component="h1">
        Blake Netzeband
      </Title>
      <Title order={4} component="p">
        Full Stack Developer
      </Title>
    </div>
  );
}
