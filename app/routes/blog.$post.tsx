/* eslint-disable import/namespace */
import { useParams } from "@remix-run/react";

import * as posts from "~/blog/index";
import Header from "~/components/header";

export default function Post() {
  const { post } = useParams();

  return (
    <>
      <Header />
      {posts[post] && posts[post].default()}
    </>
  );
}
