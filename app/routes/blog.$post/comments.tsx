import { Avatar, Button, Text, Textarea, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useFetcher, useSearchParams } from "@remix-run/react";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import React, { FormEventHandler, useState } from "react";

import { User } from "~/server/authenticator.server";
import { Comment, UserModel } from "~/server/db.singleton.server";
import { cls } from "~/utils";

import AuthModal from "./authModal";
import styles from "./post.module.css";

interface CommentsProps {
  /**
   * This includes username and a formatted date
   */
  comments: Comment[];

  /**
   * Used for batching comments
   */
  commentsTotal: number;

  /**
   * authentication state
   */
  user: User | null;
}

const iconMap = new Map<UserModel["source"], React.ReactElement>([
  ["github", <IconBrandGithubFilled key="github" />],
  ["google", <IconBrandGoogleFilled key="google" />],
]);

export default function Comments({
  commentsTotal,
  comments,
  user,
}: CommentsProps) {
  const fetcher = useFetcher();
  const [error, setError] = useToggle();
  const [searchParams, setSearchParams] = useSearchParams({ batch: "1" });
  const [value, setValue] = useState("");

  const showMore = commentsTotal > comments.length;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const comment = formData.get("comment");

    if (!comment) setError(true);
    else {
      fetcher.submit(e.currentTarget);
      setError(false);
      setValue("");
    }
  };

  const handleShowMore = () => {
    let batch = Number(searchParams.get("batch") ?? "1");
    setSearchParams({ batch: ++batch + "" });
  };

  return (
    <section className={cls(styles.flex, styles.footer)}>
      <div className={cls(styles.flex, styles.row, styles.commentHeader)}>
        <Title order={3}>Comments</Title>
        {showMore && (
          <Button
            className={styles.cta}
            variant="subtle"
            onClick={handleShowMore}
          >
            Show older
          </Button>
        )}
      </div>
      {!comments.length ? (
        <Text>None yet 😕... but you can be the first!</Text>
      ) : (
        <div className={cls(styles.flex, styles.footer)}>
          {comments.map((comment, i) => {
            const icon = iconMap.get(comment.user.source);
            const iconEl = icon
              ? React.cloneElement(icon, { className: styles.icon })
              : null;

            return (
              <section
                key={i}
                className={cls(styles.flex, styles.row, styles.comment)}
              >
                <Avatar name={comment.user.username} color="initials" />
                <div className={cls(styles.flex, styles.commentBody)}>
                  <div className={cls(styles.flex, styles.row, styles.header)}>
                    <Title order={4}>
                      {iconEl} {comment.user.username}
                    </Title>
                    <Text>{comment.date}</Text>
                  </div>
                  <Text>{comment.content}</Text>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <fetcher.Form
        className={styles.flex}
        onSubmit={handleSubmit}
        onFocus={() => setError(false)}
        method="POST"
        action="."
      >
        <Textarea
          label="What do you think?"
          name="comment"
          autosize
          minRows={4}
          error={error}
          disabled={!user}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        {!user ? (
          <AuthModal />
        ) : (
          <Button className={styles.cta} type="submit">
            Submit
          </Button>
        )}
      </fetcher.Form>
    </section>
  );
}
