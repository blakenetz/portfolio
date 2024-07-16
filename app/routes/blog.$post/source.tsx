import { Anchor, Notification, Text } from "@mantine/core";
import { IconBrandGithub, IconBrandMedium } from "@tabler/icons-react";
import { Attribute } from "types/modules";

import { capitalize, cls } from "~/util";

import styles from "./post.module.css";

interface SourceProps {
  /**
   * Source of the post
   */
  source: Attribute["source"];
  /**
   * External link
   */
  url: string;
}

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

export default function Source({ source, url }: SourceProps) {
  const { icon, text } = iconMap.get(source) ?? {};

  return icon ? (
    <Notification
      color="violet"
      className={cls(styles.alert, styles.notification)}
      withCloseButton={false}
    >
      <Text className={styles.center}>
        {text}{" "}
        <Anchor
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.center}
        >
          {icon} {capitalize(source)}
        </Anchor>
      </Text>
    </Notification>
  ) : null;
}
