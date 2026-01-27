import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Post } from '../../types';
import styles from './MostLikedPosts.module.css';

export const MostLikedPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMostLikedPosts();
    }, []);

    const loadMostLikedPosts = async () => {
        try {
            setLoading(true);
            const { postsApi } = await import('../../services/postsApi');
            const data = await postsApi.getMostLikedPosts(5);
            setPosts(data);
        } catch (error) {
            console.error('Error loading most liked posts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className={styles.sidebar}>
                <div className={styles.header}>
                    <TrendingUp size={20} />
                    <h3>Posts Mais Curtidos</h3>
                </div>
                <div className={styles.loading}>Carregando...</div>
            </Card>
        );
    }

    if (posts.length === 0) {
        return null; // Don't show sidebar if no posts with likes
    }

    return (
        <Card className={styles.sidebar}>
            <div className={styles.header}>
                <TrendingUp size={20} />
                <h3>Posts Mais Curtidos</h3>
            </div>
            <div className={styles.postsList}>
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/posts/${post.id}`}
                        className={styles.postItem}
                    >
                        {post.image_url && (
                            <div className={styles.thumbnail}>
                                <img src={post.image_url} alt={post.title} />
                            </div>
                        )}
                        <div className={styles.postInfo}>
                            <h4 className={styles.postTitle}>{post.title}</h4>
                            <div className={styles.likesCount}>
                                <Heart size={14} fill="currentColor" />
                                {post.likesCount || 0}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    );
};
