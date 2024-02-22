import { Title } from "@mantine/core";

import styles from "~/styles/layout.module.css";

export default function Header() {
  return (
    <div className={[styles.content, styles.column].join(" ")}>
      <Title order={4} component="h1">
        Blake Netzeband
      </Title>
      <Title order={4} component="h2">
        Full Stack Developer
      </Title>
    </div>
  );
}
