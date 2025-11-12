import { build, context } from "esbuild";
import { spawn } from "child_process";
import fs from "fs";

const isWatchMode = process.argv.includes("--watch");
const isProd = process.env.NODE_ENV === "production" || process.argv.includes("--prod");

async function prepareBuild() {
    await fs.promises.copyFile("./index_prod.html", "./dist/index.html");

    if (fs.existsSync("./public")) {
        await fs.promises.cp("./public", "./dist/public", { recursive: true });
    }
}

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
    sourcemap: !isProd,
    jsxFactory: "h",
    jsxFragment: "null",
    platform: "browser",
    minify: isProd,
    logLevel: "info",
    loader: {
        ".css": "css"
    }
};

await generateBlogLoader();

if (isWatchMode) {
    const ctx = await context(options);
    await ctx.watch();
    await ctx.serve({
        servedir: ".",
        port: 3000,
        fallback: "index_dev.html"
    });
    console.log("Dev server running at http://localhost:3000");
} else {
    await build(options);
    await prepareBuild();
    console.log("Build complete!");
}
