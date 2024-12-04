import fs from "node:fs/promises";

import path from "path";
import prompts from "prompts";

import { dirname } from "./util";

const blacklisted = ["index.ts", "util.ts", "start.ts"];

(async () => {
  console.log(dirname);
  const scripts = await fs
    .readdir(dirname)
    .then((files) => files.filter((file) => !blacklisted.includes(file)));

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
