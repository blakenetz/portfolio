import DB from "~/server/db.singleton.server";

async function restart() {
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
    DB.createIndex<"users">("users", { username: 1 }),
    DB.createIndex<"newUsers">("users", { email: 1 }, { sparse: true }),
  ]);
  console.log("Successfully initialized db!");

  process.exit();
}

restart();
