import { build, context } from "esbuild";
import { spawn } from "child_process";
import fs from "fs";

const isWatchMode = process.argv.includes("--watch");
const isProd = process.env.NODE_ENV === "production" || process.argv.includes("--prod");

async function prepareBuild() {
  let htmlContent = await fs.promises.readFile("./index_prod.html", "utf8");

  if (isProd) {
    try {
      const cssPath = "./dist/styles.css";
      if (fs.existsSync(cssPath)) {
        const cssContent = await fs.promises.readFile(cssPath, "utf8");
        const criticalCSS = cssContent.substring(0, 4096);
        const inlineStyle = `<style id="critical-css">${criticalCSS}</style>`;
        
        htmlContent = htmlContent.replace(
          '<link rel="stylesheet" href="./styles.css">', 
          '<link rel="stylesheet" href="./styles.css" onload="this.onload=null;this.rel=\'stylesheet\'">'
        );
        htmlContent = htmlContent.replace('</head>', `${inlineStyle}\n</head>`);
      }
    } catch (err) {
      console.error("Failed to inline critical CSS:", err);
    }
  }

  await fs.promises.writeFile("./dist/index.html", htmlContent);

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
      code === 0 
        ? resolve() 
        : reject(new Error(`Blog loader generation failed with code ${code}`));
    });
  });
}

const buildOptions = {
  entryPoints: {
    index: "src/index.ts",
    styles: "src/styles/theme.css",
    about: "src/apps/about.tsx"
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
  minifyWhitespace: isProd,
  minifySyntax: isProd,
  minifyIdentifiers: isProd,
  splitting: true,
  chunkNames: "chunks/[name]-[hash]",
  logLevel: "info",
  loader: {
    ".css": "css"
  },
  treeShaking: true,
  external: isProd ? [] : undefined
};

await generateBlogLoader();

if (isWatchMode) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  await ctx.serve({
    servedir: ".",
    port: 3000,
    fallback: "index_dev.html"
  });
  console.log("Dev server running at http://localhost:3000");
} else {
  await build(buildOptions);
  await prepareBuild();
  console.log("Build complete!");
}