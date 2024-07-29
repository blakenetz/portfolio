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
  useState,
} from "react";

import { Button } from "~/components";
import {
  AuthFetcher,
  AuthMode,
  AuthProvider,
  authProviders,
} from "~/server/auth";
import { capitalize, cls } from "~/utils";

import Field, { fields, FieldType } from "./field";
import styles from "./post.module.css";

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

export default function AuthModal() {
  const fetcher = useFetcher<AuthFetcher>();
  const [mode, setMode] = useState<AuthMode>("new");
  const [errors, setErrors] = useState<FieldType[]>([]);

  const [opened, actions] = useDisclosure();
  const location = useLocation();

  const { cta } = modeMap.get(mode)!;
  const data = Array.from(modeMap.values()).map(({ data }) => data);

  const loading = fetcher.state !== "idle";

  // useEffect(() => {
  //   const message =
  //     fetcher.data?.error ?? messages.get(fetcher.data?.status ?? "unknown");

  //   if (fetcher.data?.ok === false)
  //     notifications.show({
  //       title: "Sorry!",
  //       color: "red",
  //       withBorder: true,
  //       message: message,
  //     });
  // }, [fetcher.data]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (fetcher.data?.ok === true) {
      id = setTimeout(() => actions.close(), 750);
    }

    return () => clearTimeout(id);
  }, [actions, fetcher]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    const nextErrors: FieldType[] = [];

    if (!username) nextErrors.push("username");
    if (!password) nextErrors.push("password");
    if (mode === "new" && !email) nextErrors.push("email");

    setErrors(nextErrors);

    if (!nextErrors.length) {
      fetcher.submit(e.currentTarget);
    }
  };

  const handleChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    const name = e.target.name as FieldType;
    setErrors((prev) => prev.filter((v) => v !== name));
  };

  const handleSocialClick: MouseEventHandler<HTMLButtonElement> = (e) => {
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
            <Field key={field} field={field} mode={mode} errors={errors} />
          ))}

          <Button
            component="button"
            type="submit"
            loading={loading}
            className={styles.cta}
          >
            {fetcher.data?.ok === true ? <IconCheck /> : cta}
          </Button>

          {mode === "new" && (
            <>
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
                    {`Sign up with ${capitalize(provider)}`}
                  </MantineButton>
                ))}
              </div>
            </>
          )}
        </fetcher.Form>
      </Modal>

      <div className={cls(styles.flex, styles.authRoot)}>
        <MantineButton onClick={actions.open}>Sign up</MantineButton>
        <Text>You need to be signed in to comment</Text>
      </div>
    </>
  );
}
