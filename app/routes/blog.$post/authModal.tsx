import {
  Button as MantineButton,
  Divider,
  Modal,
  SegmentedControl,
  SegmentedControlItem,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useFetcher, useLocation } from "@remix-run/react";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconCheck,
} from "@tabler/icons-react";
import {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useReducer,
  useState,
} from "react";

import { Button } from "~/components";
import {
  AuthFetcher,
  AuthMode,
  AuthProvider,
  authProviders,
} from "~/server/auth";
import { capitalize, cls, validate } from "~/utils";

import Field, { fields, FieldType } from "./field";
import styles from "./post.module.css";

type FieldErrors = Partial<Record<FieldType, string>>;

const providerIconMap = new Map<AuthProvider, React.ReactElement>([
  ["github", <IconBrandGithub key="github" />],
  ["google", <IconBrandGoogle key="google" />],
]);

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

function reducer(
  state: FieldErrors,
  action:
    | { type: "error"; value: FieldErrors }
    | { type: "reset" }
    | { type: "resetField"; value: FieldType }
) {
  if (action.type === "reset") {
    return {};
  }
  if (action.type === "resetField") {
    const nextState = { ...state };
    delete nextState[action.value];
    return nextState;
  }

  return { ...state, ...action.value };
}

export default function AuthModal() {
  const fetcher = useFetcher<AuthFetcher>();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>("new");
  const [errors, setErrors] = useReducer(reducer, {});
  const [opened, actions] = useDisclosure();

  const { cta } = modeMap.get(mode)!;
  const data = Array.from(modeMap.values()).map(({ data }) => data);

  const loading = fetcher.state !== "idle";

  useEffect(() => {
    let id: NodeJS.Timeout;
    const { ok, field, error } = fetcher.data ?? {};
    if (ok === true) {
      id = setTimeout(() => actions.close(), 750);
    } else if (ok === false) {
      const errorField = validate(field, fields);
      if (errorField) {
        setErrors({ type: "error", value: { [errorField]: error } });
      }
    }

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    const nextErrors: FieldErrors = {};

    if (!username) nextErrors.username = "Required";
    if (!password) nextErrors.password = "Required";
    if (mode === "new" && !email) nextErrors.email = "Required";

    if (Object.keys(nextErrors).length) {
      setErrors({ type: "error", value: nextErrors });
    } else {
      fetcher.submit(e.currentTarget);
    }
  };

  const handleChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    const name = e.target.name as FieldType;
    setErrors({ type: "resetField", value: name });
  };

  const handleSocialClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setErrors({ type: "reset" });
    const provider = e.currentTarget.name;
    fetcher.submit(
      { redirectUrl: encodeURIComponent(location.pathname) },
      {
        method: "POST",
        action: `/auth/${provider}`,
      }
    );
  };

  return (
    <>
      <Modal opened={opened} onClose={actions.close} withCloseButton={false}>
        <fetcher.Form
          className={styles.flex}
          method="POST"
          action="/auth/form"
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
            <Field
              key={field}
              field={field}
              mode={mode}
              error={errors[field]}
            />
          ))}

          <Button
            component="button"
            type="submit"
            loading={loading}
            className={styles.cta}
          >
            {fetcher.data?.ok === true ? <IconCheck /> : cta}
          </Button>

          <Divider label="Or" labelPosition="center" />
          <div className={styles.flex}>
            {authProviders.map((provider) => (
              <MantineButton
                key={provider}
                name={provider}
                variant="outline"
                classNames={{ label: styles.row }}
                onClick={handleSocialClick}
              >
                {providerIconMap.get(provider)}
                {`Continue with ${capitalize(provider)}`}
              </MantineButton>
            ))}
          </div>
        </fetcher.Form>
      </Modal>

      <div className={cls(styles.flex, styles.authRoot)}>
        <MantineButton onClick={actions.open}>Sign up</MantineButton>
        <Text>You need to be signed in to comment</Text>
      </div>
    </>
  );
}
