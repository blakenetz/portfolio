import { Alert, Code, CodeProps, Flex } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import CopyButton from "./copyButton";
import styles from "./post.module.css";

type CodeBlockProps = Omit<CodeProps, "vars" | "classNames" | "styles">;

export default function CodeBlock({ children, ...rest }: CodeBlockProps) {
  const block = rest.className?.includes("language");
  const notification = rest.className?.includes("note");

  const codeProps: CodeBlockProps = {
    ...rest,
    color: "var(--mantine-color-blue-light)",
    block,
  };

  if (!block) return <Code {...codeProps}>{children}</Code>;
  else
    return notification ? (
      <Alert
        color="gray"
        icon={<IconInfoCircle />}
        title="Note:"
        className={styles.alert}
      >
        {children}
      </Alert>
    ) : (
      <Flex
        {...codeProps}
        component={Code}
        justify="space-between"
        align="center"
        gap={2}
      >
        {children}
        <CopyButton content={children} />
      </Flex>
    );
}
