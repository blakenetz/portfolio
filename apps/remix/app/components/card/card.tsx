import { Anchor, Paper, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { HTMLAttributes, PropsWithChildren } from "react";

import { PostModel } from "~/server/db.singleton.server";
import { cls } from "~/utils";

import styles from "./card.module.css";

interface CardProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  post: Omit<PostModel["meta"], "date"> & { date: string };
}

export function CardPaper({
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

export default function Card({ post, ...props }: CardProps) {
  return (
    <CardPaper {...props}>
      <Anchor component={Link} to={post.slug} className={styles.title}>
        {post.title}
      </Anchor>

      <Text>{post.description}</Text>

      <Text className={styles.text}>{`Published ${post.date}`}</Text>
    </CardPaper>
  );
}
