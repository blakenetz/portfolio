import { Button, Text, Textarea, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useFetcher } from "@remix-run/react";
import { WithId } from "mongodb";
import { FormEventHandler } from "react";

import { User } from "~/server/authenticator.server";
import { Comment } from "~/server/db.singleton.server";
import { cls } from "~/util";

import AuthModal from "./authModal";
import styles from "./post.module.css";

interface CommentsProps {
  comments?: WithId<Comment>[];

  /**
   * authentication state
   */
  user: User | null;
}

export default function Comments({ comments = [], user }: CommentsProps) {
  const fetcher = useFetcher();
  const [error, setError] = useToggle();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const comment = formData.get("comment");

    if (!comment) setError(true);
    else fetcher.submit(e.currentTarget);
  };

  return (
    <section className={cls(styles.flex, styles.comments)}>
      <Title order={3}>Comments</Title>
      {!comments.length ? (
        <Text>None yet 😕... but you can be the first!</Text>
      ) : null}

      {!user ? (
        <AuthModal />
      ) : (
        <fetcher.Form
          className={styles.flex}
          onSubmit={handleSubmit}
          method="POST"
          action="/blog/comment"
        >
          <Textarea
            label="What do you think?"
            name="comment"
            autosize
            minRows={4}
            error={error}
          />
          <Button className={styles.submit}>Submit</Button>
        </fetcher.Form>
      )}
    </section>
  );
}
