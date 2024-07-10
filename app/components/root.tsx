import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconAccessible } from "@tabler/icons-react";
import {
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

import ColorSchemeContext from "~/styles/colorSchemeContext";
import styles from "~/styles/layout.module.css";
import { cls } from "~/util";

export default function Root({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  const colorSchemeContext = useContext(ColorSchemeContext);
  const handleClick = useCallback(() => {
    colorSchemeContext.toggle((prev) => !prev);
  }, [colorSchemeContext]);

  return (
    <section {...props} className={cls(props.className, styles.background)}>
      <div className={styles.main}>
        <Tooltip label="Accessibility mode" withArrow>
          <ActionIcon
            className={styles.ada}
            variant="transparent"
            aria-label="Toggle accessibility mode"
            onClick={handleClick}
          >
            <Flex className="burn">
              <IconAccessible />
            </Flex>
          </ActionIcon>
        </Tooltip>

        {children}
      </div>
    </section>
  );
}
