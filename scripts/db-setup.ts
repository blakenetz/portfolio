import path from "path";

import { dirname } from "./util";

(async () => {
  await import(path.resolve(dirname, "db-init.ts"));
  await import(path.resolve(dirname, "db-seed.ts"));
  await import(path.resolve(dirname, "blog-push.ts"));
  await import(path.resolve(dirname, "blog-pull.ts"));
})();
