import { Params } from "@remix-run/react";
import fs from "fs";
import { writeFile } from "fs/promises";
import { WithId } from "mongodb";
import path from "path";

import DB, { Comment, Post } from "~/server/db.singleton.server";
import { formatDate, validate } from "~/util";

import { inputName, sorts } from "./blog";

export async function getPosts(request: Request) {
  const { searchParams } = new URL(request.url);

  const sortParam = searchParams.get(inputName);
  const sort = validate(sortParam, sorts);
  const direction = sort === "asc" ? 1 : -1;

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [cursor, count] = await Promise.all([
    DB.findAll("posts"),
    DB.count("posts"),
  ]);
  const posts = await cursor
    .sort({ "meta.date": direction })
    .project<Post>({ meta: 1 })
    .limit(limit)
    .skip(skip)
    .map((doc) => ({
      ...doc.meta,
      date: formatDate(doc.meta.date),
    }))
    .toArray();

  return { data: posts, count: Math.ceil(count / limit) };
}

export async function getPost(params: Params<"post">): Promise<
  | {
      ok: true;
      meta: Post["meta"];
      comments: WithId<Comment>[];
    }
  | { ok: false }
> {
  const post = await DB.findOne("posts", { "meta.slug": params.post });
  if (!post) return { ok: false };

  // ensure it exists locally
  const rootPath = path.resolve(".", "app/blog");
  const filePath = path.resolve(rootPath, post.meta.slug + ".mdx");
  const exists = fs.existsSync(filePath);

  // if not try to write
  if (!exists) {
    try {
      await writeFile(filePath, post.content.buffer);
    } catch (error) {
      return { ok: false };
    }
  }
  const commentCursor = await DB.findMany("comments", { post: post._id });
  const comments = await commentCursor.sort({ date: 1 }).toArray();

  return { ok: true, meta: post.meta, comments };
}
