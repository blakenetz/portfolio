import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  PolymorphicComponentProps,
} from "@mantine/core";

import styles from "~/styles/button.module.css";
import commonStyles from "~/styles/common.module.css";
import { cls } from "~/util";

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
