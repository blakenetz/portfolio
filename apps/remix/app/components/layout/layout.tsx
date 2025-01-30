import { ActionIcon, Tooltip } from "@mantine/core";
import { IconAccessible } from "@tabler/icons-react";
import { HTMLAttributes, PropsWithChildren, useContext } from "react";

import ColorSchemeContext from "~/styles/colorSchemeContext";
import { cls } from "~/utils";

import Header from "./header";
import styles from "./layout.module.css";
import Links from "./links";

export default function Layout({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  const colorSchemeContext = useContext(ColorSchemeContext);

  const handleClick = () => {
    colorSchemeContext.toggle((prev) => !prev);
  };

  return (
    <section {...props} className={cls(props.className, styles.background)}>
      <div className={styles.main}>
        <Tooltip label="Accessibility mode" withArrow>
          <ActionIcon
            color="teal"
            className={styles.ada}
            radius="xl"
            aria-label="Toggle accessibility mode"
            onClick={handleClick}
          >
            <IconAccessible />
          </ActionIcon>
        </Tooltip>

        <Header />

        {children}

        <Links />
      </div>
    </section>
  );
}
