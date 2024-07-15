import {
  Flex,
  SegmentedControl,
  SegmentedControlProps,
  Text,
} from "@mantine/core";
import { useCallback, useState } from "react";

import { capitalize, validate } from "~/util";

import styles from "./sortControl.module.css";

interface SortData<T> {
  /**
   * Text of label element
   * @default "Sort by"
   */
  title?: string;

  /**
   * Input name attribute
   */
  name: string;

  /**
   * possible sort values
   */
  values: ReadonlyArray<T>;

  /**
   * Initial value of input element
   */
  initialValue: T;
}

export default function Sort<T extends string>({
  title = "Sort by",
  name,
  values,
  initialValue,
}: SortData<T>) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback<
    NonNullable<SegmentedControlProps["onChange"]>
  >(
    (val) => {
      const valid = validate(val, values);
      if (valid) setValue(valid);
    },
    [values]
  );

  return (
    <Flex className={styles.root}>
      <Text>{title}</Text>
      <SegmentedControl
        value={value}
        onChange={handleChange}
        data={values.map((value) => ({ label: capitalize(value), value }))}
        size="xs"
        name={name}
      />
    </Flex>
  );
}
