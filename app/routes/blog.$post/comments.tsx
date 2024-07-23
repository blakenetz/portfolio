import { Button as MantineButton, Flex, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import AuthModal from "./authModal";

export default function Comments() {
  const [opened, actions] = useDisclosure();
  return (
    <Flex>
      <Title>Comments</Title>
      <AuthModal opened={opened} onClose={actions.close} mode="new" />
      <MantineButton onClick={actions.open}>Sign up</MantineButton>
    </Flex>
  );
}
