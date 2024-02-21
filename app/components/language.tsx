import { Badge, Flex, MantineColor, Text } from "@mantine/core";

const colors: { [key: string]: MantineColor } = {
  TypeScript: "cyan",
  JavaScript: "teal",
  Just: "grape",
};

function getColor(language: string): MantineColor {
  const color = colors[language];
  if (!color) return "orange";
  return color;
}

export default function Language({ language }: { language: string }) {
  return (
    <Flex>
      <Badge color={getColor(language)} /> <Text>{language}</Text>
    </Flex>
  );
}
