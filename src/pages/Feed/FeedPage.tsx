import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { FeaturedPost } from '../../components/blog/FeaturedPost';
import { RecentPosts } from '../../components/blog/RecentPosts';
import { PostCard } from '../../components/blog/PostCard';
import { MostLikedPosts } from '../../components/blog/MostLikedPosts';
import { TagCloud } from '../../components/blog/TagCloud';
import { Button } from '../../components/ui/Button';
import { postsApi } from '../../services/postsApi';
import type { Post } from '../../types';
import styles from './FeedPage.module.css';

const POSTS_PER_PAGE = 9;

export const FeedPage: React.FC = () => {
    const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        loadInitialData();
    }, [selectedTag]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setOffset(0);
            setPosts([]);

            let featured: Post | null = null;
            let recent: Post[] = [];

            if (!selectedTag) {
                featured = await postsApi.getFeaturedPost();
                setFeaturedPost(featured);

                recent = await postsApi.getRecentPosts(3);
                setRecentPosts(recent);
            } else {
                setFeaturedPost(null);
                setRecentPosts([]);
            }

            const feedData = await postsApi.getPosts(
                undefined,
                selectedTag || undefined,
                POSTS_PER_PAGE + 4,
                0
            );

            let filteredPosts = feedData;
            if (!selectedTag) {
                const excludeIds = new Set<number>();
                if (featured) excludeIds.add(featured.id);
                recent.forEach((p: Post) => excludeIds.add(p.id));
                filteredPosts = feedData.filter((p: Post) => !excludeIds.has(p.id));
            }

            setPosts(filteredPosts.slice(0, POSTS_PER_PAGE));
            setHasMore(feedData.length === POSTS_PER_PAGE + 4);
        } catch (err: any) {
            console.error('Erro ao carregar feed:', err);
            setError('Erro ao carregar o feed');
        } finally {
            setLoading(false);
        }
    };

    const loadMorePosts = async () => {
        try {
            setLoadingMore(true);
            const newOffset = offset + POSTS_PER_PAGE;
            const morePosts = await postsApi.getPosts(
                undefined,
                selectedTag || undefined,
                POSTS_PER_PAGE,
                newOffset
            );
            setPosts([...posts, ...morePosts]);
            setOffset(newOffset);
            setHasMore(morePosts.length === POSTS_PER_PAGE);
        } catch (err) {
            console.error('Erro ao carregar mais posts:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            await postsApi.toggleLike(postId);

            if (featuredPost?.id === postId) {
                setFeaturedPost({
                    ...featuredPost,
                    isLikedByMe: !featuredPost.isLikedByMe,
                    likesCount: (Number(featuredPost.likesCount) || 0) + (featuredPost.isLikedByMe ? -1 : 1)
                });
            }

            setRecentPosts(recentPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        isLikedByMe: !p.isLikedByMe,
                        likesCount: (Number(p.likesCount) || 0) + (p.isLikedByMe ? -1 : 1)
                    }
                    : p
            ));

            setPosts(posts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        isLikedByMe: !p.isLikedByMe,
                        likesCount: (Number(p.likesCount) || 0) + (p.isLikedByMe ? -1 : 1)
                    }
                    : p
            ));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    if (loading) {
        return (
            <AppShell>
                <div className={styles.loading}>Carregando...</div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell>
                <div className={styles.error}>
                    <p>{error}</p>
                    <button onClick={loadInitialData}>Tentar novamente</button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className={styles.container}>
                <div className={styles.feed}>
                    {featuredPost && !selectedTag && (
                        <FeaturedPost
                            post={featuredPost}
                            onLike={() => handleLike(featuredPost.id)}
                        />
                    )}

                    {recentPosts.length > 0 && !selectedTag && (
                        <RecentPosts
                            posts={recentPosts}
                            onLike={handleLike}
                        />
                    )}

                    {posts.length === 0 ? (
                        <div className={styles.empty}>Nenhum post encontrado</div>
                    ) : (
                        <>
                            <div className={styles.postsGrid}>
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onLike={() => handleLike(post.id)}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className={styles.loadMoreContainer}>
                                    <Button
                                        onClick={loadMorePosts}
                                        disabled={loadingMore}
                                        size="lg"
                                    >
                                        {loadingMore ? 'Carregando...' : 'Carregar Mais Posts'}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <aside className={styles.sidebar}>
                    <TagCloud selectedTag={selectedTag} onTagSelect={setSelectedTag} />
                    <MostLikedPosts />
                </aside>
            </div>
        </AppShell>
    );
};
