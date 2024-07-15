import { Anchor, Text } from "@mantine/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { IconBrandMedium } from "@tabler/icons-react";

import { Card, SortControl } from "~/components";
import { getPosts, postFromModule, validate } from "~/util";

import styles from "./blog.module.css";

export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

const posts = getPosts();
const inputName = "sort";
const sorts = ["asc", "desc"] as const;

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const param = searchParams.get(inputName);
  return json(
    Object.keys(posts)
      .map((filename) => postFromModule(filename, posts[filename]))
      .sort((a, b) => {
        if (param === "asc") {
          return new Date(a.date) > new Date(b.date) ? 1 : -1;
        }
        return new Date(b.date) > new Date(a.date) ? 1 : -1;
      })
  );
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
          {post.source === "medium" ? (
            <Anchor href={post.url} className={styles.anchor}>
              <IconBrandMedium /> View on Medium
            </Anchor>
          ) : null}
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
