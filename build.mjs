import { build, context } from "esbuild";

const isWatchMode = process.argv.includes("--watch");

const options = {
    entryPoints: {
        index: "src/index.ts",
        styles: "src/styles/theme.css"
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
        ".css": "css"
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
