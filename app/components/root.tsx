import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { useLocation } from "@remix-run/react";
import { IconAccessible } from "@tabler/icons-react";
import { HTMLAttributes, PropsWithChildren, useContext } from "react";

import ColorSchemeContext from "~/styles/colorSchemeContext";
import styles from "~/styles/layout.module.css";
import { cls } from "~/util";

export default function Root({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  const colorSchemeContext = useContext(ColorSchemeContext);
  const location = useLocation();

  const handleClick = () => {
    colorSchemeContext.toggle((prev) => !prev);
  };

  return (
    <section {...props} className={cls(props.className, styles.background)}>
      <div
        className={cls(
          styles.main,
          location.pathname === "/" ? styles.mix : undefined
        )}
      >
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
