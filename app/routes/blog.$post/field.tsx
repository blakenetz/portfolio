import { PasswordInput, TextInput, TextInputProps } from "@mantine/core";
import { IconKey, IconMoodTongue, IconSend } from "@tabler/icons-react";

import { AuthMode } from "~/server/auth";
import { capitalize } from "~/utils";

export const fields = ["username", "email", "password"] as const;
export type FieldType = (typeof fields)[number];

const iconMap = new Map<FieldType, React.ReactElement>([
  ["email", <IconSend key="email-icon" />],
  ["password", <IconKey key="password-icon" />],
  ["username", <IconMoodTongue key="username-icon" />],
]);

interface FieldProps {
  field: FieldType;
  mode: AuthMode;
  errors: FieldType[];
}

export default function Field({ field, mode, errors }: FieldProps) {
  const label = capitalize(field);
  const error = errors.includes(field) && `${label} is required`;

  const props: TextInputProps = {
    size: "md",
    label,
    error,
    name: field,
    leftSection: iconMap.get(field),
  };

  const Component: React.ElementType =
    field === "password" ? PasswordInput : TextInput;

  const isHidden = mode === "existing" && field === "email";

  return isHidden ? null : <Component {...props} />;
}
