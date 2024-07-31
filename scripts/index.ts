import fs from "node:fs/promises";

import path from "path";
import prompts from "prompts";

import { dirname } from "./util";

(async () => {
  const scripts = await fs
    .readdir(dirname)
    .then((files) =>
      files.filter((file) => file !== "index.ts" && file !== "util.ts")
    );

  const response = await prompts({
    type: "select",
    name: "file",
    message: "Which script would you like to run?",
    choices: scripts.map((script) => ({ title: script, value: script })),
  });

  if (response.file) {
    const filePath = path.resolve(dirname, response.file);
    await import(filePath);
  }
})();
