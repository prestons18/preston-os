import { h, signal } from "fuse";
import { defineApp, styled, VStack, Button, Icon, Text } from "../pmod";
import { marked } from "marked";
import { api, BlogPost } from "../api";

const BrowserHeader = styled('div', {
    padding: 'var(--space-sm) var(--space-md)',
    background: 'var(--bg-soft)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
});

const AddressBar = styled('div', {
    flex: '1',
    padding: 'var(--space-xs) var(--space-sm)',
    background: 'var(--bg-base)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255,255,255,0.06)',
});

const BrowserContent = styled('div', {
    flex: '1',
    overflowY: 'auto',
    padding: 'var(--space-lg)',
    background: 'var(--bg-base)',
});

const markdownStyles = `
.markdown-content {
    font-size: var(--text-base);
    line-height: 1.7;
    color: var(--text-primary);
    max-width: 800px;
    margin: 0 auto;
}
.markdown-content h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin-top: var(--space-xl);
    margin-bottom: var(--space-md);
    color: var(--text-primary);
    border-bottom: 2px solid rgba(255,255,255,0.1);
    padding-bottom: var(--space-sm);
}
.markdown-content h2 {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
    color: var(--text-primary);
}
.markdown-content h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-top: var(--space-md);
    margin-bottom: var(--space-sm);
    color: var(--text-primary);
}
.markdown-content p {
    margin-bottom: var(--space-md);
    color: var(--text-secondary);
}
.markdown-content ul, .markdown-content ol {
    margin-bottom: var(--space-md);
    padding-left: var(--space-lg);
    color: var(--text-secondary);
}
.markdown-content li {
    margin-bottom: var(--space-xs);
}
.markdown-content code {
    background: var(--bg-soft);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 0.9em;
    font-family: monospace;
    color: var(--text-primary);
}
.markdown-content pre {
    background: var(--bg-soft);
    padding: var(--space-md);
    border-radius: var(--radius-base);
    overflow-x: auto;
    margin-bottom: var(--space-md);
}
.markdown-content pre code {
    background: transparent;
    padding: 0;
}
.markdown-content blockquote {
    border-left: 4px solid rgba(255,255,255,0.2);
    padding-left: var(--space-md);
    margin-left: 0;
    margin-bottom: var(--space-md);
    color: var(--text-muted);
    font-style: italic;
}
.markdown-content a {
    color: var(--accent);
    text-decoration: none;
}
.markdown-content a:hover {
    text-decoration: underline;
}
.markdown-content strong {
    font-weight: 600;
    color: var(--text-primary);
}
.markdown-content hr {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: var(--space-lg) 0;
}
`;

const PostMeta = styled('div', {
    maxWidth: '800px',
    margin: '0 auto var(--space-lg)',
    paddingBottom: 'var(--space-md)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
});

const PostTitle = styled('h1', {
    fontSize: 'var(--text-3xl)',
    fontWeight: '700',
    marginBottom: 'var(--space-sm)',
    color: 'var(--text-primary)',
});

const PostDate = styled('div', {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginBottom: 'var(--space-xs)',
});

const PostDescription = styled('div', {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    marginTop: 'var(--space-sm)',
});

marked.setOptions({
    breaks: true,
    gfm: true,
});

defineApp({
    name: "Browser",
    icon: "Globe",
    width: 900,
    height: 700,
    showInDock: false,
    content(props) {
        const url = signal(props?.url || '');
        const content = signal('');
        const loading = signal(false);
        const post = signal<BlogPost | null>(null);
        
        const loadUrl = (newUrl: string) => {
            url.set(newUrl);
            loading.set(true);
            
            // Check if it's a blog post URL
            const blogMatch = newUrl.match(/^\/blog\/(.+)$/);
            if (blogMatch) {
                const slug = blogMatch[1];
                try {
                    const blogPost = api.handle(`/api/posts/${slug}`, {}) as BlogPost;
                    if (blogPost) {
                        post.set(blogPost);
                        const html = marked(blogPost.content);
                        content.set(html as string);
                    } else {
                        content.set('<p style="color: var(--text-muted)">Blog post not found.</p>');
                        post.set(null);
                    }
                } catch (error) {
                    console.error('Failed to load blog post:', error);
                    content.set('<p style="color: var(--text-muted)">Failed to load blog post.</p>');
                    post.set(null);
                }
            } else {
                content.set('<p style="color: var(--text-muted)">Unknown URL format.</p>');
                post.set(null);
            }
            
            loading.set(false);
        };
        
        // Inject markdown styles
        if (!document.getElementById('markdown-styles')) {
            const style = document.createElement('style');
            style.id = 'markdown-styles';
            style.textContent = markdownStyles;
            document.head.appendChild(style);
        }
        
        // Load initial URL if provided
        if (props?.url) {
            loadUrl(props.url);
        }
        
        const goBack = () => {
            // TODO: Implement history
            console.log('Back button clicked');
        };
        
        const goForward = () => {
            // history
            console.log('Forward button clicked');
        };
        
        const refresh = () => {
            const currentUrl = url.get();
            if (currentUrl) {
                loadUrl(currentUrl);
            }
        };
        
        return (
            <VStack gap={0} style="height: 100%">
                <BrowserHeader>
                    <Button variant="ghost" onClick={goBack} style="padding: var(--space-xs)">
                        <Icon name="ChevronLeft" size={18} />
                    </Button>
                    <Button variant="ghost" onClick={goForward} style="padding: var(--space-xs)">
                        <Icon name="ChevronRight" size={18} />
                    </Button>
                    <Button variant="ghost" onClick={refresh} style="padding: var(--space-xs)">
                        <Icon name="RefreshCw" size={16} />
                    </Button>
                    <AddressBar>{() => url.get() || 'about:blank'}</AddressBar>
                </BrowserHeader>
                
                <BrowserContent>
                    {() => {
                        if (loading.get()) {
                            return <Text>Loading...</Text>;
                        }
                        
                        const currentPost = post.get();
                        
                        return (
                            <div>
                                {currentPost && (
                                    <PostMeta>
                                        <PostTitle>{currentPost.title}</PostTitle>
                                        <PostDate>{currentPost.date}</PostDate>
                                        {currentPost.description && (
                                            <PostDescription>{currentPost.description}</PostDescription>
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
