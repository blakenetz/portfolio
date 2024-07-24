import { Button as MantineButton, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { WithId } from "mongodb";

import { Comment } from "~/server/db.singleton.server";

import AuthModal from "./authModal";
import styles from "./post.module.css";

interface CommentsProps {
  comments?: WithId<Comment>[];
}
``;

export default function Comments({ comments = [] }: CommentsProps) {
  const [opened, actions] = useDisclosure();
  return (
    <section className={styles.flex}>
      <Title order={3}>Comments</Title>
      {!comments.length ? <Text>Non yet :/</Text> : null}
      <AuthModal opened={opened} onClose={actions.close} mode="new" />
      <MantineButton onClick={actions.open}>Sign up</MantineButton>
    </section>
  );
}
