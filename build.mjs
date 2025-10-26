import { build, context } from "esbuild";
import { resolve } from "path";

const isWatchMode = process.argv.includes("--watch");

const options = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    format: "esm",
    target: ["esnext"],
    sourcemap: true,
    jsxFactory: "h",
    jsxFragment: "null",
    platform: "browser",
    minify: false,
    logLevel: "info",
    alias: {
        "fuse": resolve("../fuse/src/fuse/index.ts")
    }
};

if (isWatchMode) {
    const ctx = await context(options);
    await ctx.watch();
    await ctx.serve({
        servedir: ".",
        port: 3000,
        fallback: "index.html"
    });
    console.log("Dev server running at http://localhost:3000");
} else {
    await build(options);
    console.log("Build complete!");
}
