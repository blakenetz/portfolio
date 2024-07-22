import bcrypt from "bcrypt";

import DB from "~/server/db.singleton.server";

(async () => {
  console.log("Seeding users...");
  const arr = Array.from({ length: 20 }, (_v, i) => i + 1);

  const salt = bcrypt.genSaltSync();

  const { insertedIds } = await DB.createMany<"users">(
    "users",
    arr.map((i) => ({
      username: `User-${i}`,
      password: bcrypt.hashSync("1234" + i, salt),
    }))
  );

  console.log("Seeding posts and comments...");
  await Promise.all([
    DB.createMany<"posts">(
      "posts",
      arr.map((i) => ({
        meta: { date: new Date() },
        content: `Post number ${i}`,
      }))
    ),
    DB.createMany<"comments">(
      "comments",
      Object.values(insertedIds).map((id, i) => ({
        user: id,
        content: `Comment number ${i}`,
      }))
    ),
  ]);

  console.log("Successfully seeded!");

  process.exit();
})();
