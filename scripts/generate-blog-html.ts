import fs from "fs";
import path from "path";
import { marked } from "marked";
import { posts } from "../src/controllers/blog.js";
import "../src/blog/loader.js";

async function generateBlogHTML() {
  const outputDir = path.join(process.cwd(), "dist/blog");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Get all blog posts
    const allPosts = Object.values(posts);
    console.log(`Found ${allPosts.length} blog posts to generate`);

    if (allPosts.length === 0) {
      console.warn("No blog posts found.");
      return;
    }

    // Generate HTML for each post
    for (const post of allPosts) {
      const postDir = path.join(outputDir, post.slug);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${post.title} | PrestonOS Blog</title>
  <meta name="description" content="${post.description || ""}">
  
  <meta property="og:type" content="article">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.description || ""}">
  <meta property="og:url" content="https://prestonarnold.uk/blog/${post.slug}">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.description || ""}">
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${post.title}",
    "description": "${post.description || ""}",
    "datePublished": "${post.date}",
    "author": {
      "@type": "Person",
      "name": "Preston Arnold"
    }
  }
  </script>
  
  <link rel="stylesheet" href="/styles.css">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segose UI', Roboto, sans-serif; }
    #root { min-height: 100vh; }
    .post-content { padding: 1rem; max-width: 800px; margin: 0 auto; }
    h1 { margin-top: 0; padding: 1rem 1rem 0; }
    .post-meta { padding: 0 1rem; color: #666; }
  </style>
</head>
<body>
  <div id="root">
    <div data-blog-post data-slug="${post.slug}">
      <h1>${post.title}</h1>
      <div class="post-meta">
        <time datetime="${new Date(post.date).toISOString()}">
          ${new Date(post.date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <div class="post-content">${marked(post.content)}</div>
    </div>
  </div>
  
  <script src="/index.js" type="module"></script>
</body>
</html>`;

      const outputPath = path.join(postDir, "index.html");
      fs.writeFileSync(outputPath, html);
      console.log(`Generated: ${outputPath}`);
    }

    console.log(
      `Successfully generated ${allPosts.length} blog post HTML files`
    );
  } catch (error) {
    console.error("Error generating blog post HTML:", error);
    process.exit(1);
  }
}

generateBlogHTML();
