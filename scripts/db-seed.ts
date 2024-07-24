import { add } from "date-fns";
import { Binary } from "mongodb";

import DB, { Comment } from "~/server/db.singleton.server";
import { hashPassword } from "~/util";

import { generateBaseMDxContent } from "./util";

const today = new Date();

(async () => {
  console.log("Seeding users and posts...");
  const arr = Array.from({ length: 20 }, (_v, i) => i + 1);

  const [{ insertedIds: userIds }, { insertedIds: postIds }] =
    await Promise.all([
      DB.createMany<"users">(
        "users",
        arr.map((i) => ({
          username: `User-${i}`,
          password: hashPassword("1234" + i),
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
              date: add(today, { hours: i }),
              title,
              description: `This is my ${i} post`,
              slug: `post-${i}`,
            },
          };
        })
      ),
    ]);

  console.log("Seeding comments...");
  const users = Object.values(userIds);
  const comments: Comment[] = Object.values(postIds).flatMap((post) => {
    // give every post 5 comments
    return Array.from({ length: 5 }, (_el, i) => i + 1).map((i) => ({
      user: users[Math.floor(Math.random() * users.length) + 1],
      post: post,
      content: `Comment number ${i}`,
      date: add(today, { hours: i }),
    }));
  });

  await await DB.createMany<"comments">("comments", comments);

  console.log("Successfully seeded!");

  process.exit();
})();
