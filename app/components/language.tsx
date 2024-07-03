import { Badge, Flex, MantineColor, Text } from "@mantine/core";

import styles from "~/styles/repos.module.css";

const colors: { [key: string]: MantineColor } = {
  TypeScript: "cyan",
  JavaScript: "teal",
  Just: "grape",
  CSS: "yellow",
  HTML: "yellow",
  Ruby: "red",
  Python: "violet",
};

function getColor(language: string): MantineColor {
  const color = colors[language];
  if (!color) return "orange";
  return color;
}

export default function Language({ language }: { language: string }) {
  return (
    <Flex>
      <Badge className={styles.badge} color={getColor(language)} />{" "}
      <Text>{language}</Text>
    </Flex>
  );
}
