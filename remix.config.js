/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  postcss: true,
  cacheDirectory: '.cache',
  // cloudflare
  server: "./server.ts",
  serverBuildPath: "functions/[[path]].js",
  serverConditions: ["workerd", "worker", "browser"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  // one of Oktokit's deps uses "os", so we need to polyfill it
  serverNodeBuiltinsPolyfill: {
    modules: {
      os: true,
    },
    globals: {
      process: true
    }
  }
};
