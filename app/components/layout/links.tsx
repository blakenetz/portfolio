import { Anchor } from "@mantine/core";
import {
  IconBrandGithubFilled,
  IconBrandLinkedin,
  IconBrandMedium,
} from "@tabler/icons-react";

import styles from "~/styles/common.module.css";

export default function Links() {
  return (
    <div className={[styles.content, styles.links].join(" ")}>
      <Anchor
        href="https://github.com/blakenetz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconBrandGithubFilled aria-label="Github" />
      </Anchor>

      <Anchor
        href="https://www.linkedin.com/in/blakenetz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconBrandLinkedin aria-label="LinkedIn" />
      </Anchor>

      <Anchor
        href="https://medium.com/@blakenetz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconBrandMedium aria-label="Medium" />
      </Anchor>

      <Anchor href="mailto:blakenetzeband@gmail.com">
        blakenetzeband@gmail.com
      </Anchor>
    </div>
  );
}
