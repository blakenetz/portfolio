import { CodeHighlight } from "@mantine/code-highlight";
import { Alert, Code, CodeProps, Flex } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { ExtraProps } from "react-markdown";

import CopyButton from "./copyButton";
import styles from "./post.module.css";

interface CodeBlockProps
  extends Omit<CodeProps, "vars" | "classNames" | "styles">,
    ExtraProps {}

export default function CodeBlock({ children, node, ...rest }: CodeBlockProps) {
  const block = rest.className?.includes("language");
  const notification = rest.className?.includes("note");
  const language = rest.className?.split("-")[1];
  const hideCopy = node?.data?.meta === "no-copy";

  const codeProps: Partial<CodeBlockProps> = {
    ...rest,
    color: "var(--mantine-color-blue-light)",
    block,
  };

  if (!block) return <Code {...codeProps}>{children}</Code>;
  if (notification)
    return (
      <Alert
        color="gray"
        icon={<IconInfoCircle />}
        title="Note:"
        className={styles.alert}
      >
        {children}
      </Alert>
    );
  if (typeof children === "string")
    return (
      <CodeHighlight
        code={children}
        language={language}
        color="var(--mantine-color-blue-light)"
        withCopyButton={!hideCopy}
      />
    );

  return (
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
