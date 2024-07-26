import { Anchor, Breadcrumbs, Title } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Link, useLocation } from "@remix-run/react";
import { IconMoodHappyFilled } from "@tabler/icons-react";

import commonStyles from "~/styles/common.module.css";
import { cls, useElementRect } from "~/utils";

import styles from "./layout.module.css";

export default function Header(props: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation();
  const [ref, rect] = useElementRect<HTMLDivElement>();
  const [scroll] = useWindowScroll();

  const fixedClass = Boolean(rect && scroll.y > rect.bottom) && styles.fixed;

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
    <Breadcrumbs
      className={cls(styles.breadcrumbs, fixedClass)}
      ref={ref}
      component="nav"
    >
      {paths.map((path, i) => (
        <Anchor
          key={path}
          component={Link}
          to={paths.slice(0, i + 1).join("/")}
          className={styles.anchor}
        >
          {path || <IconMoodHappyFilled />}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}
