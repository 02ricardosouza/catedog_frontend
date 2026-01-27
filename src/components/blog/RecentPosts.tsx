import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import type { Post } from '../../types';
import styles from './RecentPosts.module.css';

interface RecentPostsProps {
    posts: Post[];
    onLike?: (postId: number) => void;
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts, onLike }) => {
    if (posts.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Clock size={24} />
                <h2 className={styles.title}>Posts Recentes</h2>
            </div>

            <div className={styles.grid}>
                {posts.map((post) => (
                    <Link key={post.id} to={`/posts/${post.id}`} className={styles.card}>
                        {post.image_url && (
                            <div className={styles.imageContainer}>
                                <img src={post.image_url} alt={post.title} className={styles.image} />
                            </div>
                        )}

                        <div className={styles.content}>
                            <div className={styles.authorSection}>
                                <Avatar
                                    src={post.author?.avatarUrl}
                                    alt={post.author?.name || post.author_name || 'User'}
                                    size="sm"
                                />
                                <span className={styles.authorName}>
                                    {post.author?.name || post.author_name}
                                </span>
                            </div>

                            <h3 className={styles.postTitle}>{post.title}</h3>

                            <p className={styles.excerpt}>
                                {post.content.substring(0, 100)}
                                {post.content.length > 100 && '...'}
                            </p>

                            <div className={styles.footer}>
                                <button
                                    className={`${styles.stat} ${post.isLikedByMe ? styles.liked : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onLike?.(post.id);
                                    }}
                                    aria-label="Curtir"
                                >
                                    <Heart size={16} fill={post.isLikedByMe ? 'currentColor' : 'none'} />
                                    {post.likesCount || 0}
                                </button>
                                <div className={styles.stat}>
                                    <MessageCircle size={16} />
                                    {post.commentsCount || 0}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
