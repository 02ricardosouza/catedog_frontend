import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star, Tag as TagIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import type { Post } from '../../types';
import styles from './FeaturedPost.module.css';

interface FeaturedPostProps {
    post: Post;
    onLike?: () => void;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({ post, onLike }) => {
    return (
        <div className={styles.container}>
            <div className={styles.badge}>
                <Star size={16} fill="currentColor" />
                Post em Destaque
            </div>

            <Link to={`/posts/${post.id}`} className={styles.card}>
                {post.image_url && (
                    <div className={styles.imageContainer}>
                        <img src={post.image_url} alt={post.title} className={styles.image} />
                        <div className={styles.overlay} />
                    </div>
                )}

                <div className={styles.content}>
                    <div className={styles.header}>
                        <Avatar
                            src={post.author?.avatarUrl}
                            alt={post.author?.name || post.author_name || 'User'}
                            size="lg"
                        />
                        <div className={styles.authorInfo}>
                            <span className={styles.authorName}>
                                {post.author?.name || post.author_name}
                            </span>
                            <span className={styles.date}>
                                {new Date(post.created_at || Date.now()).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>

                    <h2 className={styles.title}>{post.title}</h2>

                    <p className={styles.excerpt}>
                        {post.content.substring(0, 200)}
                        {post.content.length > 200 && '...'}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                        <div className={styles.tags}>
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.name}
                                    className={styles.tag}
                                    style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                                >
                                    <TagIcon size={14} />
                                    {tag.name}
                                </span>
                            ))}
                            {post.tags.length > 3 && (
                                <span className={styles.moreTags}>+{post.tags.length - 3}</span>
                            )}
                        </div>
                    )}

                    <div className={styles.footer}>
                        <button
                            className={`${styles.statButton} ${post.isLikedByMe ? styles.liked : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onLike?.();
                            }}
                            aria-label="Curtir"
                        >
                            <Heart size={20} fill={post.isLikedByMe ? 'currentColor' : 'none'} />
                            {post.likesCount || 0}
                        </button>
                        <div className={styles.statButton}>
                            <MessageCircle size={20} />
                            {post.commentsCount || 0}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};
