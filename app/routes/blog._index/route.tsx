import {
  Anchor,
  Flex,
  SegmentedControl,
  SegmentedControlProps,
  Text,
} from "@mantine/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { IconBrandMedium } from "@tabler/icons-react";
import { useCallback, useState } from "react";

import { Card } from "~/components";
import { getPosts, postFromModule } from "~/util";

import styles from "./blog.module.css";

export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

const posts = getPosts();
const inputName = "sort";
export const sorts = ["asc", "desc"] as const;
export type Sort = (typeof sorts)[number];

function validate(val: string | null): Sort | null {
  const sort = val as Sort | null;
  if (sort && sorts.includes(sort)) return sort;
  return null;
}

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

  const initialValue = validate(searchParams.get(inputName));

  const [value, setValue] = useState(initialValue ?? "desc");

  const handleChange = useCallback<
    NonNullable<SegmentedControlProps["onChange"]>
  >((val) => {
    const valid = validate(val);
    if (valid) setValue(valid);
  }, []);

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

      <Flex className={styles.control}>
        <Text>Sort by last</Text>
        <SegmentedControl
          value={value}
          onChange={handleChange}
          data={[
            { label: "Asc", value: "asc" },
            { label: "Desc", value: "desc" },
          ]}
          size="xs"
          name={inputName}
        />
      </Flex>
    </Form>
  );
}
