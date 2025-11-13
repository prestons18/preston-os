import { ApiRouter } from "fuse";
import { posts } from "../controllers/blog";

const api = new ApiRouter();

api.get('/api/posts', () => Object.values(posts));
api.get('/api/posts/:slug', (params) => posts[params.slug] || null);

export { api };