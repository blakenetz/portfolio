import { Params } from "@remix-run/react";
import fs from "fs";
import { writeFile } from "fs/promises";
import { ObjectId } from "mongodb";
import path from "path";

import DB, { Comment, PostModel } from "~/server/db.singleton.server";
import { getSession } from "~/services/session.server";
import { formatDate, validate, validateString } from "~/util";

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
    .project<PostModel>({ meta: 1 })
    .limit(limit)
    .skip(skip)
    .map((doc) => ({
      ...doc.meta,
      date: formatDate(doc.meta.date),
    }))
    .toArray();

  return { data: posts, count: Math.ceil(count / limit) };
}

async function getPostByParams(params: Params<"post">) {
  return DB.findOne("posts", { "meta.slug": params.post });
}

export async function getPost(params: Params<"post">): Promise<
  | {
      ok: true;
      meta: PostModel["meta"];
      comments: Comment[];
    }
  | { ok: false }
> {
  const post = await getPostByParams(params);
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

  const commentCursor = await DB.aggregate(
    "comments",
    { post: post._id },
    "users"
  );

  const comments = await commentCursor
    .sort({ date: -1 })
    .map<Comment>((comment) => {
      console.log(comment);
      return {
        user: comment.users_model.username,
        content: comment.content,
        date: formatDate(comment.date),
      };
    })
    .toArray();

  return { ok: true, meta: post.meta, comments };
}

export async function postComment(request: Request, params: Params<"post">) {
  const formData = await request.formData();
  const comment = validateString(formData.get("comment"));
  if (!comment) return { ok: false, error: "Please add a comment" };

  const session = await getSession(request.headers.get("cookie"));
  const user = session.get("user-id");
  if (!user) return { ok: false, error: "Please login" };

  const post = await getPostByParams(params);
  const results = await DB.createOne<"comments">("comments", {
    user: new ObjectId(user),
    post: post!._id,
    content: comment,
    date: new Date(),
  });

  console.log(results);
}
