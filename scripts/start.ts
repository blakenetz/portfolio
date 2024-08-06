import type { SpawnOptions } from "child_process";
import { spawn } from "child_process";

import DB from "~/server/db.singleton.server";

const [mode] = process.argv.slice(2);

if (!mode) throw new Error("pass a mode argument!");

// Function to run the cleanup script
async function cleanup() {
  await DB.close();
  console.log("🌻 Clean up finished!");
}

// Handling process termination signals
process.on("SIGINT", () => {
  console.log("🌻 Received SIGINT. Running cleanup...");
  cleanup().finally(() => process.exit());
});

process.on("SIGTERM", () => {
  console.log("🌻 Received SIGTERM. Running cleanup...");
  cleanup().finally(() => process.exit());
});

// Start the Remix Vite server
console.log(`🌻 Starting vite server in ${mode} mode`);

const options: SpawnOptions = {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
};

const args =
  mode === "production"
    ? ["remix-serve", "./build/server/index.js"]
    : ["remix", "vite:dev"];

const vite = spawn("npx", args, options);

vite.on("close", (code) => {
  console.log(
    `🌻 Remix Vite server exited with code ${code}. Running cleanup...`
  );
  cleanup();
});
