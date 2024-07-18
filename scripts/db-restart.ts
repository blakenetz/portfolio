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
  console.log("Successfully restarted!");

  process.exit();
}

restart();
