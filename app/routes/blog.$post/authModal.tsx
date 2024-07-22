import {
  Modal,
  ModalProps,
  PasswordInput,
  SegmentedControl,
  SegmentedControlItem,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { IconKey, IconMoodTongue, IconSend } from "@tabler/icons-react";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

import { Button } from "~/components";
import { AuthMode } from "~/server/auth";
import { capitalize } from "~/util";

import styles from "./post.module.css";

const fields = ["username", "email", "password"] as const;
type Field = (typeof fields)[number];

interface FieldProps {
  field: Field;
  mode: AuthMode;
  errors: Field[];
}

const iconMap = new Map<Field, React.ReactElement>([
  ["email", <IconSend key="email-icon" />],
  ["password", <IconKey key="password-icon" />],
  ["username", <IconMoodTongue key="username-icon" />],
]);

function Field({ field, mode, errors }: FieldProps) {
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

  const isHidden = mode === "new" && field === "email";

  return isHidden ? null : <Component {...props} />;
}

const modeMap = new Map<AuthMode, { cta: string; data: SegmentedControlItem }>([
  ["new", { cta: "Log in", data: { value: "new", label: "Sign in" } }],
  [
    "existing",
    {
      cta: "Create account",
      data: { value: "existing", label: "New account" },
    },
  ],
]);

interface AuthModalProps extends ModalProps {
  /**
   * Controls form UI
   */
  mode: AuthMode;
}

export default function AuthModal({
  opened,
  mode: defaultMode,
  ...rest
}: AuthModalProps) {
  const fetcher = useFetcher();
  const [mode, setMode] = useState(defaultMode);
  const [errors, setErrors] = useState<Field[]>([]);

  const { cta } = modeMap.get(mode)!;
  const data = Array.from(modeMap.values()).map(({ data }) => data);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    const formData = new FormData(e.currentTarget);

    formData.append("mode", mode);

    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    const nextErrors: Field[] = [];

    if (!username) nextErrors.push("username");
    if (!password) nextErrors.push("password");
    if (mode === "new" && !email) nextErrors.push("email");

    setErrors(nextErrors);

    if (!nextErrors.length) {
      fetcher.submit(formData);
    }
  };

  const handleChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    const name = e.target.name as Field;
    setErrors((prev) => prev.filter((v) => v !== name));
  };

  return (
    <Modal opened={opened} {...rest} withCloseButton={false}>
      <SegmentedControl
        fullWidth
        data={data}
        value={mode}
        onChange={(v) => setMode(v as AuthMode)}
      />

      <fetcher.Form
        method="POST"
        action="/auth/form"
        className={styles.form}
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        {fields.map((field) => (
          <Field key={field} field={field} mode={mode} errors={errors} />
        ))}

        <Button component="button" type="submit">
          {cta}
        </Button>
      </fetcher.Form>
    </Modal>
  );
}
