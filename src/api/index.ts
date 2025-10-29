import { ApiRouter } from "fuse";

const api = new ApiRouter();

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
}

const posts: Record<string, BlogPost> = {};

function parseFrontmatter(raw: string) {
  const lines = raw.split('\n');
  
  // Check if the content starts with frontmatter
  if (lines[0] !== '---') {
    return { meta: {}, content: raw };
  }
  
  // Find where the frontmatter ends
  let endLine = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      endLine = i;
      break;
    }
  }
  
  // No closing delimiter found
  if (endLine === -1) {
    return { meta: {}, content: raw };
  }
  
  // Parse the metadata between the delimiters
  const meta: Record<string, string> = {};
  for (let i = 1; i < endLine; i++) {
    const line = lines[i];
    const colonPosition = line.indexOf(':');
    
    if (colonPosition > 0) {
      const key = line.slice(0, colonPosition).trim();
      const value = line.slice(colonPosition + 1).trim();
      meta[key] = value;
    }
  }
  
  // Everything after the closing --- is the content
  const content = lines.slice(endLine + 1).join('\n');
  
  return { meta, content };
}

export function addPost(slug: string, raw: string) {
  const { meta, content } = parseFrontmatter(raw);
  posts[slug] = { slug, ...meta, content } as BlogPost;
}

api.get('/api/posts', () => Object.values(posts));
api.get('/api/posts/:slug', (params) => posts[params.slug] || null);

export { api };