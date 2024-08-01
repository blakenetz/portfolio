import DB from "~/server/db.singleton.server";

export default async function init() {
  console.log("Dropping existing collections...");
  await DB.destroy();
  console.log("Creating new collections...");
  await Promise.all([
    DB.createCollect("users"),
    DB.createCollect("posts"),
    DB.createCollect("comments"),
  ]);
  console.log("Creating unique index");
  await Promise.all([
    DB.createIndex<"users">("users", { username: 1, source: 1 }),
    DB.createIndex<"newUsers">("users", { email: 1 }, { sparse: true }),
  ]);
  console.log("Successfully initialized db!");

  process.exit();
}

await init().finally(() => process.exit());
