import { h, signal } from "@prestonarnold/fuse";
import {
  defineApp,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  Icon,
} from "../../pmod";
import { BlogPost } from "../../controllers/blog";
import { formatDate } from "../../utils/date";
import { api } from "../../router/api";
import { createAppOpener } from "../../utils/opener";
import {
  PostCard,
  PostDate,
  ReadingTime,
  PostDescription,
  TagsContainer,
  Tag,
} from "./blog.styles";

defineApp({
  name: "Blog",
  icon: "BookOpen",
  width: 600,
  height: 700,
  content() {
    const posts = signal<BlogPost[]>([]);
    const loading = signal(true);
    const appOpener = createAppOpener(window.mobileOpenApp);

    // Fetch posts from API
    const fetchPosts = () => {
      loading.set(true);
      try {
        const result = api.handle("/api/posts", {});
        posts.set(result || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        posts.set([]);
      }
      loading.set(false);
    };

    fetchPosts();

    const viewPost = (post: BlogPost) => {
      const url = `/blog/${post.slug}`;
      appOpener.open("Browser", { url });
    };

    return (
      <VStack
        gap={16}
        style="padding: var(--space-lg); overflow-y: auto; height: 100%"
      >
        <HStack
          gap={12}
          style="align-items: center; justify-content: space-between"
        >
          <Heading>Blog Posts</Heading>
          <Button
            variant="ghost"
            onClick={fetchPosts}
            style="padding: var(--space-xs)"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
        </HStack>

        {() => {
          if (loading.get()) {
            return <Text>Loading posts...</Text>;
          }

          const postList = posts.get();
          if (postList.length === 0) {
            return (
              <Text style="color: var(--text-muted)">No blog posts found.</Text>
            );
          }

          return (
            <VStack gap={12}>
              {postList.map((p) => (
                <PostCard
                  onClick={() => viewPost(p)}
                  onTouchStart={(e: TouchEvent) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e: TouchEvent) => {
                    e.preventDefault();
                    viewPost(p);
                  }}
                >
                  <Heading style="font-size: var(--text-lg); margin: 0">
                    {p.title}
                  </Heading>
                  <PostDate>
                    {formatDate(p.date)}
                    {p.readingTime && (
                      <>
                        <span>-</span>
                        <ReadingTime>{p.readingTime} min read</ReadingTime>
                      </>
                    )}
                  </PostDate>
                  {p.description && (
                    <PostDescription>{p.description}</PostDescription>
                  )}

                  {p.tags && p.tags.length > 0 && (
                    <TagsContainer>
                      {p.tags.map((tag) => (
                        <Tag>{tag}</Tag>
                      ))}
                    </TagsContainer>
                  )}
                </PostCard>
              ))}
            </VStack>
          );
        }}
      </VStack>
    );
  },
});
