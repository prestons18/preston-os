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

function hydrateBlogPost(postSignal: any, contentSignal: any) {
  const postElement = document.querySelector("[data-blog-post]");
  if (!postElement) return null;

  const slug = postElement.getAttribute("data-slug");
  if (!slug) return null;

  // If we have a pre-rendered post, extract its content
  const title = postElement.querySelector("h1")?.textContent || "";
  const date =
    postElement.querySelector("time")?.getAttribute("datetime") || "";
  const content = postElement.querySelector(".post-content")?.innerHTML || "";

  // If we have content, use it for the initial render
  if (content) {
    const post = {
      title,
      date,
      content,
      slug,
      description: "",
      readingTime: null,
      tags: [],
    };

    // Set the initial state
    postSignal.set(post);
    contentSignal.set(content);
    return post;
  }

  return null;
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
    const postSignal = signal<BlogPost | null>(null);
    const contentSignal = signal("");
    const loading = signal(false);

    // Initialize with pre-rendered content if available
    if (typeof window !== "undefined") {
      const preRenderedPost = hydrateBlogPost(postSignal, contentSignal);
      if (preRenderedPost) {
        // If we have pre-rendered content, we can still fetch fresh data in the background
        const match = window.location.pathname.match(/^\/blog\/(.+)$/);
        if (match) {
          api
            .handle(`/api/posts/${match[1]}`, {})
            .then((blogPost: BlogPost) => {
              if (blogPost) {
                postSignal.set(blogPost);
                contentSignal.set(marked(blogPost.content) as string);
              }
            })
            .catch(console.error);
        }
      }
    }

    const loadUrl = (newUrl: string) => {
      url.set(newUrl);
      loading.set(true);

      const match = newUrl.match(/^\/blog\/(.+)$/);
      if (match) {
        try {
          const blogPost = api.handle(`/api/posts/${match[1]}`, {}) as BlogPost;
          if (blogPost) {
            postSignal.set(blogPost);
            contentSignal.set(marked(blogPost.content) as string);
          } else {
            postSignal.set(null);
            contentSignal.set("<p>Post not found</p>");
          }
        } catch (e) {
          postSignal.set(null);
          contentSignal.set("<p>Failed to load</p>");
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

            const p = postSignal.get();
            const currentContent = contentSignal.get();
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
                <div class="markdown-content" innerHTML={currentContent} />
              </div>
            );
          }}
        </BrowserContent>
      </VStack>
    );
  },
});
