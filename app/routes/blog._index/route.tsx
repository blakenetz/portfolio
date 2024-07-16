import { Anchor, Text } from "@mantine/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

import { fetchPosts, inputName, sorts } from "~/api/blog";
import { Card, SortControl } from "~/components";
import { validate } from "~/util";

import styles from "./blog.module.css";

export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

export function loader({ request }: LoaderFunctionArgs) {
  const posts = fetchPosts(request);

  return json(posts);
}

export default function Blog() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const posts = useLoaderData<typeof loader>();

  const initialValue = validate(searchParams.get(inputName), sorts) ?? "desc";

  return (
    <Form
      className={styles.posts}
      method="GET"
      onChange={(e) => submit(e.currentTarget)}
    >
      {posts.map((post) => (
        <Card key={post.slug}>
          <Anchor
            component={Link}
            to={`.${post.slug}`}
            className={styles.title}
          >
            {post.title}
          </Anchor>

          <Text>{post.description}</Text>

          <Text className={styles.text}>{`Published ${post.date}`}</Text>
        </Card>
      ))}

      <SortControl
        name={inputName}
        values={sorts}
        initialValue={initialValue}
      />
    </Form>
  );
}
