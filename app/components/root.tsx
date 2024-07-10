import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconAccessible } from "@tabler/icons-react";
import { HTMLAttributes, PropsWithChildren, useContext } from "react";

import ColorSchemeContext from "~/styles/colorSchemeContext";
import styles from "~/styles/common.module.css";
import { cls } from "~/util";

export default function Root({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  const colorSchemeContext = useContext(ColorSchemeContext);

  const handleClick = () => {
    colorSchemeContext.toggle((prev) => !prev);
  };

  return (
    <section {...props} className={cls(props.className, styles.background)}>
      <div className={cls(styles.main)}>
        <Tooltip label="Accessibility mode" withArrow>
          <ActionIcon
            className={styles.ada}
            variant="transparent"
            aria-label="Toggle accessibility mode"
            onClick={handleClick}
          >
            <Flex>
              <IconAccessible />
            </Flex>
          </ActionIcon>
        </Tooltip>

        {children}
      </div>
    </section>
  );
}
