import { Button, Title, useMantineTheme } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { SerializeFrom } from "@remix-run/node";
import {
  IconBrandLinkedin,
  IconBrandReddit,
  IconClipboard,
  IconMail,
} from "@tabler/icons-react";

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
  const clipboard = useClipboard({ timeout: 500 });
  const theme = useMantineTheme();

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

  const emailHref =
    "mailto:yourfriend@gmail.com?" +
    new URLSearchParams({
      subject: "Check out this amazing article I read",
      body: 'Make sure to update the "To" field before sending!',
    })
      .toString()
      .replace(/\+/g, "%20");

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
        <Button
          leftSection={<IconMail />}
          component="a"
          target="_blank"
          href={emailHref}
        >
          Email
        </Button>
        <Button
          leftSection={<IconClipboard />}
          onClick={() => clipboard.copy(url)}
          color={clipboard.copied ? "indigo.3" : theme.primaryColor}
        >
          {clipboard.copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </section>
  );
}
