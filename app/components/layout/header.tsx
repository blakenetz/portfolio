import { Anchor, Breadcrumbs, Title } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import { IconMoodHappyFilled } from "@tabler/icons-react";

import commonStyles from "~/styles/common.module.css";
import { cls } from "~/util";

import styles from "./layout.module.css";

export default function Header(props: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation();
  const home = location.pathname === "/";
  const paths = location.pathname.split("/");

  return home ? (
    <div
      {...props}
      className={cls(
        commonStyles.column,
        commonStyles.burn,
        commonStyles.content,
        props.className
      )}
    >
      <Title order={4} component="h1">
        Blake Netzeband
      </Title>
      <Title order={4} component="p">
        Full Stack Developer
      </Title>
    </div>
  ) : (
    <Breadcrumbs className={styles.breadcrumbs}>
      {paths.map((path, i) => (
        <Anchor
          key={path}
          component={Link}
          to={paths.slice(0, i + 1).join("/")}
          className={styles.anchor}
          c="red.4"
        >
          {path || <IconMoodHappyFilled />}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}
