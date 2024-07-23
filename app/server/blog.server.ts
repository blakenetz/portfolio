import DB, { Post } from "~/server/db.singleton.server";
import { formatDate, validate } from "~/util";

import { inputName, sorts } from "./blog";

export async function getPosts(request: Request) {
  const { searchParams } = new URL(request.url);
  const param = searchParams.get(inputName);
  const sort = validate(param, sorts);
  const direction = sort === "asc" ? 1 : -1;

  const cursor = await DB.findAll("posts");
  const posts = cursor
    .sort({ "meta.date": direction })
    .project<Post>({ meta: 1 })
    .map((doc) => ({
      ...doc.meta,
      date: formatDate(doc.meta.date),
    }))
    .toArray();

  return posts;
}
