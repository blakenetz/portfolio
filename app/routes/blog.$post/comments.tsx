import { Button as MantineButton, Flex, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { WithId } from "mongodb";

import { Comment } from "~/server/db.singleton.server";

import AuthModal from "./authModal";

interface CommentsProps {
  comments?: WithId<Comment>[];
}
``;

export default function Comments({ comments = [] }: CommentsProps) {
  const [opened, actions] = useDisclosure();
  return (
    <Flex>
      <Title>Comments</Title>
      {!comments.length ? <Text>Non yet :/</Text> : null}
      <AuthModal opened={opened} onClose={actions.close} mode="new" />
      <MantineButton onClick={actions.open}>Sign up</MantineButton>
    </Flex>
  );
}
