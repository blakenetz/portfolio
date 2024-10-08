import { sub } from "date-fns";
import { Binary, ObjectId } from "mongodb";

import DB, { CommentModel } from "~/server/db.singleton.server";
import { hashPassword } from "~/utils";

import { generateBaseMDxContent } from "./util";

const today = new Date();

export default async function seed() {
  console.log("Seeding users and posts...");
  const arr = Array.from({ length: 10 }, (_v, i) => i + 1);

  const results = await Promise.all([
    DB.createMany<"users">(
      "users",
      arr.map((i) => ({
        username: `User ${i}`,
        password: hashPassword("1234" + i),
        source: "form",
        email: `user${i}@test.com`,
      }))
    ),
    DB.createMany<"socialUsers">(
      "users",
      arr.map((i) => ({
        username: `User ${i}`,
        source: "github",
      }))
    ),
    DB.createMany<"socialUsers">(
      "users",
      arr.map((i) => ({
        username: `User ${i}`,
        source: "google",
      }))
    ),
    DB.createMany<"posts">(
      "posts",
      arr.map((i) => {
        const title = `Post ${i}`;
        const base64 = btoa(generateBaseMDxContent(title));
        return {
          content: Binary.createFromBase64(base64),
          meta: {
            date: sub(today, { hours: i }),
            title,
            description: `This is my ${i} post`,
            slug: `post-${i}`,
          },
        };
      })
    ),
  ]);

  console.log("Seeding comments...");
  const postIds = Object.values(results[3].insertedIds);
  const userIds = results.slice(0, 2).reduce<ObjectId[]>((acc, v) => {
    acc.push(...Object.values(v.insertedIds));
    return acc;
  }, []);

  const comments: CommentModel[] = postIds.flatMap((post) => {
    // give every post 10 comments
    return Array.from({ length: 10 }, (_el, i) => i + 1).map((i) => {
      const user = userIds[Math.floor(Math.random() * userIds.length)];
      return {
        user,
        post: post,
        content: `comment number  ${i}.`,
        date: sub(today, { hours: i, minutes: i * 10 }),
      };
    });
  });

  await DB.createMany<"comments">("comments", comments);

  console.log("Successfully seeded!");

  process.exit();
}

await seed().finally(() => process.exit());
