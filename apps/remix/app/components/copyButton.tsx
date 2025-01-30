import { ActionIcon, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconClipboard } from "@tabler/icons-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  /**
   * Content to send to clipboard api
   */
  content?: ReactNode;
}

export default function CopyButton({ content, ...rest }: CopyButtonProps) {
  const clipboard = useClipboard();
  return (
    <Tooltip label="Copy to clipboard" withArrow>
      <ActionIcon
        {...rest}
        variant="transparent"
        aria-label="Toggle accessibility mode"
        onClick={() => clipboard.copy(content)}
      >
        <IconClipboard />
      </ActionIcon>
    </Tooltip>
  );
}
