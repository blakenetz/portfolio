import { Flex, FlexProps } from "@mantine/core";

import commonStyles from "~/styles/common.module.css";
import { cls } from "~/utils";

import styles from "./reader.module.css";

export default function Reader({ className, ...props }: FlexProps) {
  return (
    <Flex
      className={cls(commonStyles.column, styles.reader, className)}
      {...props}
    />
  );
}
