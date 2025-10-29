import { build, context } from "esbuild";
import { spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(spawn);
const isWatchMode = process.argv.includes("--watch");

// Generate blog loader before building
async function generateBlogLoader() {
    return new Promise((resolve, reject) => {
        const proc = spawn("node", ["scripts/generate-blog-loader.mjs"], {
            stdio: "inherit"
        });
        proc.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Blog loader generation failed with code ${code}`));
        });
    });
}

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

// Generate blog loader first
await generateBlogLoader();

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
