import { h, signal } from "@prestonarnold/fuse";
import { defineApp, VStack, Button, Icon, Text } from "../../pmod";
import { marked } from "marked";
import { BlogPost } from "../../controllers/blog";
import { formatLongDate } from "../../utils/date";
import { api } from "../../router/api";
import {
  BrowserHeader,
  AddressBar,
  BrowserContent,
  PostMeta,
  PostTitle,
  PostDate,
  ReadingTime,
  PostDescription,
  Tag,
  MarkdownStyles,
} from "./browser.styles";

if (!document.getElementById("markdown-styles")) {
  const style = document.createElement("style");
  style.id = "markdown-styles";
  style.textContent = MarkdownStyles;
  document.head.appendChild(style);
}

defineApp({
  name: "Browser",
  icon: "Globe",
  width: 900,
  height: 700,
  showInDock: false,
  content(props) {
    const safeProps = props || {};
    const url = signal(safeProps.url || "");
    const post = signal<BlogPost | null>(null);
    const content = signal("");
    const loading = signal(false);

    const loadUrl = (newUrl: string) => {
      url.set(newUrl);
      loading.set(true);

      const match = newUrl.match(/^\/blog\/(.+)$/);
      if (match) {
        try {
          const blogPost = api.handle(`/api/posts/${match[1]}`, {}) as BlogPost;
          if (blogPost) {
            post.set(blogPost);
            content.set(marked(blogPost.content) as string);
          } else {
            post.set(null);
            content.set("<p>Post not found</p>");
          }
        } catch (e) {
          post.set(null);
          content.set("<p>Failed to load</p>");
        }
      }
      loading.set(false);
    };

    if (safeProps.url) {
      loadUrl(safeProps.url);
    }

    return (
      <VStack gap={0} style="height: 100%">
        <BrowserHeader>
          <Button
            variant="ghost"
            onClick={() => {}}
            style="padding: var(--space-xs)"
          >
            <Icon name="ChevronLeft" size={18} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => loadUrl(url.get())}
            style="padding: var(--space-xs)"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
          <AddressBar>{() => url.get() || "about:blank"}</AddressBar>
        </BrowserHeader>

        <BrowserContent>
          {() => {
            if (loading.get()) return <Text>Loading...</Text>;

            const p = post.get();
            return (
              <div>
                {p && (
                  <PostMeta>
                    <PostTitle>{p.title}</PostTitle>
                    <PostDate>
                      {formatLongDate(p.date)}
                      {p.readingTime && (
                        <>
                          <span>-</span>
                          <ReadingTime>{p.readingTime} min read</ReadingTime>
                        </>
                      )}
                    </PostDate>
                    {p.tags && (
                      <div style="margin-top: var(--space-sm)">
                        {p.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                    {p.description && (
                      <PostDescription>{p.description}</PostDescription>
                    )}
                  </PostMeta>
                )}
                <div class="markdown-content" innerHTML={content.get()} />
              </div>
            );
          }}
        </BrowserContent>
      </VStack>
    );
  },
});
