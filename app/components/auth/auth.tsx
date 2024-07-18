import { Button } from "@mantine/core";
import { Form } from "@remix-run/react";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { ButtonHTMLAttributes } from "react";

import { AvailableProvider, availableProviders } from "~/server/auth.server";
import { capitalize } from "~/util";

interface AuthProviderButtonProps
  extends React.PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  provider: AvailableProvider;
}

const providerIconMap = new Map<AvailableProvider, React.ReactElement>([
  ["github", <IconBrandGithub key="github-icon" />],
  ["google", <IconBrandGoogle key="google-icon" />],
]);

function AuthProviderButton({ provider, ...rest }: AuthProviderButtonProps) {
  return (
    <Form action={`/auth/${provider}`} method="post">
      <Button {...rest} type="submit" />
    </Form>
  );
}

export default function Auth() {
  return availableProviders.map((provider) => (
    <AuthProviderButton provider={provider} key={provider}>
      {providerIconMap.get(provider)} {capitalize(provider)}
    </AuthProviderButton>
  ));
}
