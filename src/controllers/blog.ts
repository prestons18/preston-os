export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
  tags?: string[];
  readingTime?: number;
}

export const posts: Record<string, BlogPost> = {};

export function addPost(slug: string, data: Record<string, any>, content: string) {
  posts[slug] = { slug, ...data, content } as BlogPost;
}