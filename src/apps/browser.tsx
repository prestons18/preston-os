import { h, signal } from "@prestonarnold/fuse";
import { defineApp, styled, VStack, Button, Icon, Text } from "../pmod";
import { marked } from "marked";
import { BlogPost } from "../controllers/blog";
import { formatLongDate } from "../utils/date";
import { api } from "../router/api";

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
    display: 'flex',
    gap: 'var(--space-sm)',
    alignItems: 'center',
});

const ReadingTime = styled('span', {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
});

const PostDescription = styled('div', {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    marginTop: 'var(--space-sm)',
});

const Tag = styled('span', {
    fontSize: 'var(--text-xs)',
    padding: '4px 10px',
    marginRight: 'var(--space-xs)',
    borderRadius: '999px',
    background: 'var(--bg-muted)',
    color: 'var(--text-muted)',
    border: '1px solid rgba(255,255,255,0.1)',
});

const markdownStyles = `
.markdown-content {
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
    color: var(--text-secondary);
}
.markdown-content h1, .markdown-content h2, .markdown-content h3 {
    color: var(--text-primary);
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
}
.markdown-content p { margin-bottom: var(--space-md); }
.markdown-content ul, .markdown-content ol {
    padding-left: var(--space-xl);
    margin-bottom: var(--space-md);
}
.markdown-content li { margin-bottom: var(--space-xs); }
.markdown-content code {
    background: var(--bg-soft);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
}
.markdown-content pre {
    background: var(--bg-soft);
    padding: var(--space-md);
    border-radius: var(--radius-base);
    overflow-x: auto;
}
.markdown-content a {
    color: var(--accent);
    text-decoration: none;
}
`;

if (!document.getElementById('markdown-styles')) {
    const style = document.createElement('style');
    style.id = 'markdown-styles';
    style.textContent = markdownStyles;
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
        const url = signal(safeProps.url || '');
        const post = signal<BlogPost | null>(null);
        const content = signal('');
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
                        content.set('<p>Post not found</p>');
                    }
                } catch (e) {
                    post.set(null);
                    content.set('<p>Failed to load</p>');
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
                    <Button variant="ghost" onClick={() => {}} style="padding: var(--space-xs)">
                        <Icon name="ChevronLeft" size={18} />
                    </Button>
                    <Button variant="ghost" onClick={() => loadUrl(url.get())} style="padding: var(--space-xs)">
                        <Icon name="RefreshCw" size={16} />
                    </Button>
                    <AddressBar>{() => url.get() || 'about:blank'}</AddressBar>
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
                                                    <ReadingTime>
                                                        {p.readingTime} min read
                                                    </ReadingTime>
                                                </>
                                            )}
                                        </PostDate>
                                        {p.tags && <div style="margin-top: var(--space-sm)">
                                            {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
                                        </div>}
                                        {p.description && <PostDescription>{p.description}</PostDescription>}
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