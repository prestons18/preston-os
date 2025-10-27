// build.js
import { build, context } from "esbuild";

const isWatchMode = process.argv.includes("--watch");

const options = {
  entryPoints: {
    index: "src/index.ts",
    styles: "src/styles/theme.css",
    "ts.worker": "node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js",
    "editor.worker": "node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
  },
  bundle: true,
  outdir: "dist",
  format: "esm",
  target: ["esnext"],
  sourcemap: true,
  jsxFactory: "h",
  jsxFragment: "null",
  platform: "browser",
  minify: false,
  logLevel: "info",
  loader: {
    ".css": "css",
    ".ttf": "file"
  },
  external: []
};

if (isWatchMode) {
  const ctx = await context(options);
  await ctx.watch();
  const { host, port } = await ctx.serve({
    servedir: ".",
    port: 3000,
    fallback: "index.html",
    onRequest: (args) => console.log(`${args.method} ${args.path}`)
  });
  console.log(`Dev server running at http://${host}:${port}`);
} else {
  await build(options);
  console.log("Build complete!");
}