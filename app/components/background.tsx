import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconAccessible } from "@tabler/icons-react";
import {
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

import Header from "~/components/header";
import Links from "~/components/links";
import ColorSchemeContext from "~/styles/colorSchemeContext";
import styles from "~/styles/layout.module.css";

interface BackgroundProps extends HTMLAttributes<HTMLElement> {
  /**
   * Additional content is shown for index page
   */
  index?: boolean;
}

export default function Background({
  children,
  index,
  ...props
}: PropsWithChildren<BackgroundProps>) {
  const colorSchemeContext = useContext(ColorSchemeContext);
  const handleClick = useCallback(() => {
    colorSchemeContext.toggle();
  }, [colorSchemeContext]);

  return (
    <section
      {...props}
      className={[props.className, styles.background, props.className]
        .join(" ")
        .trim()}
    >
      <div className={[styles.main, index ? styles.mix : null].join(" ")}>
        <Tooltip label="Accessibility mode" withArrow>
          <ActionIcon
            className={styles.ada}
            variant="transparent"
            size="lg"
            aria-label="Toggle accessibility mode"
            onClick={handleClick}
          >
            <Flex className="burn">
              <IconAccessible size="lg" />
            </Flex>
          </ActionIcon>
        </Tooltip>
        {index ? (
          <div className={styles.center}>
            <Header />
            {children}
            <Links />
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
