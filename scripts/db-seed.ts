import DB from "~/server/db.singleton.server";

(async () => {
  console.log("Seeding users...");
  const arr = Array.from({ length: 20 }, (_v, i) => i + 1);

  const { insertedIds } = await DB.createMany<"users">(
    "users",
    arr.map((i) => ({
      username: `User-${i}`,
      password: "1234" + i,
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
