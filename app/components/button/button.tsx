import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  PolymorphicComponentProps,
} from "@mantine/core";

import commonStyles from "~/styles/common.module.css";
import { cls } from "~/util";

import styles from "./button.module.css";

export default function Button<C>(
  props: PolymorphicComponentProps<C, MantineButtonProps>
) {
  return (
    <div className={cls(commonStyles.burn, styles.root, props.className)}>
      <MantineButton
        {...(props as MantineButtonProps)}
        variant="filled"
        className={styles.button}
      />
    </div>
  );
}
