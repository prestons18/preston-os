import { ApiRouter } from "fuse";

import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

const api = new ApiRouter();

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
  tags?: string[];
  readingTime?: number;
}

const posts: Record<string, BlogPost> = {};

export function addPost(slug: string, data: Record<string, any>, content: string) {
  posts[slug] = { slug, ...data, content } as BlogPost;
}

api.get('/api/posts', () => Object.values(posts));
api.get('/api/posts/:slug', (params) => posts[params.slug] || null);

export { api };