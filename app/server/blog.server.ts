import { Params } from "@remix-run/react";
import { Filter, ObjectId } from "mongodb";

import DB, {
  Comment,
  CommentModel,
  PostModel,
} from "~/server/db.singleton.server";
import { getSession } from "~/services/session.server";
import {
  exists,
  formatDate,
  Status,
  status,
  validate,
  validateString,
} from "~/utils";

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

export async function getPost(
  request: Request,
  params: Params<"post">
): Promise<
  | {
      ok: true;
      post: PostModel;
      comments: Comment[];
      commentsTotal: number;
    }
  | { ok: false; errorStatus: Status }
> {
  const post = await getPostByParams(params);
  if (!post) return { ok: false, errorStatus: status.post };

  const { searchParams } = new URL(request.url);
  const batch = Number(searchParams.get("batch"));
  const limit = Number.isInteger(batch) && batch > 0 ? batch : 1;
  const filter: Filter<CommentModel> = { post: post._id };

  const [commentCursor, commentsTotal] = await Promise.all([
    DB.aggregate("comments", filter, "users"),
    DB.count("comments", filter),
  ]);

  const comments = await commentCursor
    .sort({ date: -1 })
    .limit(limit * 5)
    .map<Comment>((comment) => {
      return {
        user: comment.users_model.username,
        content: comment.content,
        date: formatDate(comment.date),
      };
    })
    .toArray()
    .then((v) => v.reverse());

  return { ok: true, post, comments, commentsTotal };
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

  return { ok: results.acknowledged };
}
