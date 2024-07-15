import { Paper } from "@mantine/core";
import { HTMLAttributes, PropsWithChildren } from "react";

import { cls } from "~/util";

import styles from "./card.module.css";

export default function Card({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <Paper
      {...props}
      shadow="sm"
      withBorder
      className={cls(styles.outline, props.className)}
    >
      <Paper className={styles.repo}>{children}</Paper>
    </Paper>
  );
}
