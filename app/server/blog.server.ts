import { Params } from "@remix-run/react";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";

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

export async function getPost(params: Params<"post">): Promise<
  | {
      ok: true;
      meta: Post["meta"];
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

  return { ok: true, meta: post.meta };
}
