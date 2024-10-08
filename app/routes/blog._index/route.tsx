import { Anchor, Pagination, PaginationProps, Text } from "@mantine/core";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useState } from "react";

import { Card, SortControl } from "~/components";
import { inputName, sorts } from "~/server/blog";
import { getPosts } from "~/server/blog.server";
import { getCanonicalLink, getSearchString, validate } from "~/utils";

import styles from "./blog.module.css";

export const meta: MetaFunction = ({ location }) => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
  getCanonicalLink(location),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await getPosts(request);

  return json(posts);
}

export default function Blog() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const { data, count } = useLoaderData<typeof loader>();
  const location = useLocation();

  const [activePage, setPage] = useState(1);

  const initialValue = validate(searchParams.get(inputName), sorts) ?? "desc";

  const sortControl = (
    <SortControl name={inputName} values={sorts} initialValue={initialValue} />
  );

  const getItemProp: PaginationProps["getItemProps"] = (page) => ({
    component: Link,
    to: { search: getSearchString(location, { page }) },
  });

  const getControlProps: PaginationProps["getControlProps"] = (control) => {
    let page;
    let disabled = false;
    switch (control) {
      case "first":
        page = 0;
        disabled = activePage <= 1;
        break;
      case "last":
        page = count;
        disabled = activePage >= count;
        break;
      case "next":
        page = activePage + 1;
        disabled = activePage >= count;
        break;
      case "previous":
        page = activePage - 1;
        disabled = activePage <= 1;
        break;
    }

    return {
      component: disabled ? "button" : Link,
      disabled,
      to: disabled
        ? undefined
        : { search: getSearchString(location, { page }) },
    };
  };

  return (
    <Form
      className={styles.posts}
      method="GET"
      onChange={(e) => submit(e.currentTarget)}
    >
      {data.map((post) => (
        <Card key={post.title}>
          <Anchor component={Link} to={post.slug} className={styles.title}>
            {post.title}
          </Anchor>

          <Text>{post.description}</Text>

          <Text className={styles.text}>{`Published ${post.date}`}</Text>
        </Card>
      ))}

      {count > 1 ? (
        <div className={styles.controls}>
          <Pagination
            total={count}
            getItemProps={getItemProp}
            getControlProps={getControlProps}
            value={activePage}
            onChange={setPage}
          />
          {sortControl}
        </div>
      ) : (
        sortControl
      )}
    </Form>
  );
}
