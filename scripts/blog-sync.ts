import fs from "fs";
import path from "path";

import DB from "~/server/db.singleton.server";

const dir = path.join(__dirname, "scripts");

(async () => {
  console.log("Uploading blog posts...");
  fs.readdir(dir, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach(async (file) => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      console.log(content);

      //   await DB.create<"posts">("posts", { content, meta: {} });
      console.log(`File ${file} uploaded successfully`);
    });
  });

  process.exit();
})();
