import {
  Alert,
  Modal,
  ModalProps,
  PasswordInput,
  SegmentedControl,
  SegmentedControlItem,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useFetcher } from "@remix-run/react";
import {
  IconKey,
  IconMoodConfuzed,
  IconMoodTongue,
  IconSend,
} from "@tabler/icons-react";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

import { Button } from "~/components";
import { AuthFetcher, AuthMode } from "~/server/auth";
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

  const isHidden = mode === "existing" && field === "email";

  return isHidden ? null : <Component {...props} />;
}

const modeMap = new Map<AuthMode, { cta: string; data: SegmentedControlItem }>([
  [
    "existing",
    { cta: "Sign in", data: { value: "existing", label: "Sign in" } },
  ],
  [
    "new",
    {
      cta: "Create account",
      data: { value: "new", label: "New account" },
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
  const fetcher = useFetcher<AuthFetcher>();
  const [mode, setMode] = useState(defaultMode);
  const [errors, setErrors] = useState<Field[]>([]);
  const [showNotification, { close, open }] = useDisclosure();

  const { cta } = modeMap.get(mode)!;
  const data = Array.from(modeMap.values()).map(({ data }) => data);

  const loading = fetcher.state !== "idle";
  const showError = !loading && showNotification && fetcher.data?.ok === false;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    const nextErrors: Field[] = [];

    if (!username) nextErrors.push("username");
    if (!password) nextErrors.push("password");
    if (mode === "new" && !email) nextErrors.push("email");

    setErrors(nextErrors);

    if (!nextErrors.length) {
      fetcher.submit(e.currentTarget);
      open();
    }
  };

  const handleChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    const name = e.target.name as Field;
    setErrors((prev) => prev.filter((v) => v !== name));
  };

  return (
    <Modal opened={opened} {...rest} withCloseButton={false}>
      <fetcher.Form
        method="POST"
        action="/auth/form"
        className={styles.form}
        onSubmit={handleSubmit}
        onChange={handleChange}
      >
        <SegmentedControl
          fullWidth
          data={data}
          value={mode}
          name="mode"
          onChange={(v) => setMode(v as AuthMode)}
        />

        {fields.map((field) => (
          <Field key={field} field={field} mode={mode} errors={errors} />
        ))}

        <Button component="button" type="submit" loading={loading}>
          {cta}
        </Button>
      </fetcher.Form>

      {showError && (
        <Alert
          color="red"
          variant="light"
          onClose={close}
          className={styles.authNotification}
          withCloseButton
          closeButtonLabel="Dismiss"
          icon={<IconMoodConfuzed />}
        >
          {fetcher.data?.error}
        </Alert>
      )}
    </Modal>
  );
}
