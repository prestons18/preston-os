import { h, signal } from "fuse";
import { defineApp, styled, VStack, HStack, Button, Heading, Text, Icon } from "../pmod";
import { api, BlogPost } from "../api";

const PostCard = styled('div', {
    padding: 'var(--space-md)',
    background: 'var(--bg-soft)',
    borderRadius: 'var(--radius-base)',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
});

const PostDate = styled('div', {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginTop: 'var(--space-xs)',
});

const PostDescription = styled('div', {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    marginTop: 'var(--space-sm)',
});

const PostContent = styled('div', {
    fontSize: 'var(--text-base)',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap',
});

defineApp({
    name: "Blog",
    icon: "BookOpen",
    width: 600,
    height: 700,
    content() {
        const posts = signal<BlogPost[]>([]);
        const selectedPost = signal<BlogPost | null>(null);
        const loading = signal(true);

        // Fetch posts from API
        const fetchPosts = () => {
            loading.set(true);
            try {
                const result = api.handle('/api/posts', {});
                posts.set(result || []);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
                posts.set([]);
            }
            loading.set(false);
        };

        // Initial fetch
        fetchPosts();

        const viewPost = (post: BlogPost) => {
            selectedPost.set(post);
        };

        const backToList = () => {
            selectedPost.set(null);
        };

        return (
            <VStack gap={0} style="height: 100%">
                {() => {
                    const post = selectedPost.get();
                    
                    if (post) {
                        // Post detail view
                        return (
                            <VStack gap={16} style="padding: var(--space-lg); overflow-y: auto; height: 100%">
                                <HStack gap={12} style="align-items: center">
                                    <Button variant="ghost" onClick={backToList} style="padding: var(--space-xs)">
                                        <Icon name="ArrowLeft" size={20} />
                                    </Button>
                                    <Heading style="flex: 1">{post.title}</Heading>
                                </HStack>
                                
                                <PostDate>{post.date}</PostDate>
                                
                                {post.description && (
                                    <PostDescription>{post.description}</PostDescription>
                                )}
                                
                                <PostContent>{post.content}</PostContent>
                            </VStack>
                        );
                    }
                    
                    // Posts list view
                    return (
                        <VStack gap={16} style="padding: var(--space-lg); overflow-y: auto; height: 100%">
                            <HStack gap={12} style="align-items: center; justify-content: space-between">
                                <Heading>Blog Posts</Heading>
                                <Button variant="ghost" onClick={fetchPosts} style="padding: var(--space-xs)">
                                    <Icon name="RefreshCw" size={16} />
                                </Button>
                            </HStack>
                            
                            {() => {
                                if (loading.get()) {
                                    return <Text>Loading posts...</Text>;
                                }
                                
                                const postList = posts.get();
                                if (postList.length === 0) {
                                    return <Text style="color: var(--text-muted)">No blog posts found.</Text>;
                                }
                                
                                return (
                                    <VStack gap={12}>
                                        {postList.map(p => (
                                            <PostCard onClick={() => viewPost(p)}>
                                                <Heading style="font-size: var(--text-lg); margin: 0">
                                                    {p.title}
                                                </Heading>
                                                <PostDate>{p.date}</PostDate>
                                                {p.description && (
                                                    <PostDescription>{p.description}</PostDescription>
                                                )}
                                            </PostCard>
                                        ))}
                                    </VStack>
                                );
                            }}
                        </VStack>
                    );
                }}
            </VStack>
        );
    },
});
