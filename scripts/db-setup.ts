import pull from "./blog-pull";
import push from "./blog-push";
import init from "./db-init";
import seed from "./db-seed";

(async () => {
  await init();
  await seed();
  await pull();
  await push();
})();
