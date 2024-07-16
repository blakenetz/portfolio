import { Anchor } from "@mantine/core";
import { IconBrandGithub, IconBrandMedium } from "@tabler/icons-react";
import { Source as SourceType } from "types/modules";

import { capitalize } from "~/util";

import styles from "./blog.module.css";

interface SourceProps {
  source: SourceType;
  url: string;
}

const iconMap = new Map<SourceType, React.ReactNode>([
  ["medium", <IconBrandMedium key="medium" />],
  ["github", <IconBrandGithub key="github" />],
]);

export default function Source({ source, url }: SourceProps) {
  const icon = iconMap.get(source);

  return icon ? (
    <Anchor href={url} className={styles.anchor}>
      {icon} {`View on ${capitalize(source)}`}
    </Anchor>
  ) : null;
}
