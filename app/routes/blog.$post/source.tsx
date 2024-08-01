import { Anchor, Notification, Text } from "@mantine/core";
import { IconBrandGithub, IconBrandMedium } from "@tabler/icons-react";
import { Attribute } from "types/modules";

import { capitalize, cls } from "~/utils";

import styles from "./post.module.css";
import { PostModel } from "~/server/db.singleton.server";
import { SerializeFrom } from "@remix-run/node";

const iconMap = new Map<
  Attribute["source"],
  { icon: React.ReactNode; text: string }
>([
  [
    "medium",
    {
      text: "This post was originally published on",
      icon: <IconBrandMedium key="medium" />,
    },
  ],
  [
    "github",
    {
      text: "View accompanying code on",
      icon: <IconBrandGithub key="github" />,
    },
  ],
]);

export default function Source({
  meta,
}: {
  meta: SerializeFrom<PostModel["meta"]>;
}) {
  if (!meta.source || !meta.url) return null;

  const { icon, text } = iconMap.get(meta.source)!;

  return (
    <Notification
      color="violet"
      className={cls(styles.alert, styles.notification)}
      withCloseButton={false}
    >
      <Text className={styles.center}>
        {text}{" "}
        <Anchor
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.center}
        >
          {icon} {capitalize(meta.source)}
        </Anchor>
      </Text>
    </Notification>
  );
}
