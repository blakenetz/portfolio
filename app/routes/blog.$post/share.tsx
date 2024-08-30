import { Button, Title } from "@mantine/core";
import { SerializeFrom } from "@remix-run/node";
import { IconBrandLinkedin, IconBrandReddit } from "@tabler/icons-react";

import { PostModel } from "~/server/db.singleton.server";
import { cls } from "~/utils";

import styles from "./post.module.css";

interface ShareProps {
  /**
   * URL used for share links
   */
  url: string;
  /** Meta data of blog post */
  meta: SerializeFrom<PostModel["meta"]>;
}

export default function Share({ url, meta }: ShareProps) {
  const linkedinHref =
    "http://www.linkedin.com/shareArticle?" +
    new URLSearchParams({
      mini: "true",
      url,
    }).toString();

  const redditHref =
    "https://www.reddit.com/submit?" +
    new URLSearchParams({
      url,
      title: meta.title,
      type: "LINK",
    }).toString();

  return (
    <section className={cls(styles.flex, styles.comments)}>
      <Title order={3}>Share</Title>
      <div className={cls(styles.flex, styles.row)}>
        <Button
          leftSection={<IconBrandLinkedin />}
          component="a"
          target="_blank"
          href={linkedinHref}
        >
          LinkedIn
        </Button>

        <Button
          leftSection={<IconBrandReddit />}
          component="a"
          target="_blank"
          href={redditHref}
        >
          Reddit
        </Button>
      </div>
    </section>
  );
}
