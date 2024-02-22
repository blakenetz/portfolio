import { Title } from "@mantine/core";

import styles from "~/styles/layout.module.css";

export default function Header() {
  return (
    <div className={[styles.content, styles.column].join(" ")}>
      <Title order={4} component="p">
        Blake Netzeband
      </Title>
      <Title order={4} component="p">
        Full Stack Developer
      </Title>
    </div>
  );
}
