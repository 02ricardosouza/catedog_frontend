import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Tag as TagIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import type { Post } from '../../types';
import styles from './PostCard.module.css';

interface PostCardProps {
    post: Post;
    onLike?: () => void;
    onFollow?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onFollow }) => {
    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <div className={styles.author}>
                    <Avatar src={post.author?.avatarUrl} alt={post.author?.name || post.author_name || 'User'} size="md" />
                    <span className={styles.authorName}>{post.author?.name || post.author_name}</span>
                </div>
                {onFollow && (
                    <Button variant="secondary" size="sm" onClick={onFollow}>
                        <UserPlus size={16} />
                        Seguir
                    </Button>
                )}
            </div>

            <Link to={`/posts/${post.id}`} className={styles.content}>
                <h3 className={styles.title}>{post.title}</h3>
                {post.image_url && (
                    <div className={styles.imageContainer}>
                        <img src={post.image_url} alt={post.title} className={styles.image} />
                    </div>
                )}
                <p className={styles.excerpt}>
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 && '...'}
                </p>
                {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.map((tag) => (
                            <span
                                key={tag.name}
                                className={styles.tag}
                                style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                            >
                                <TagIcon size={12} />
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
                <span className={styles.readMore}>Leia mais</span>
            </Link>

            <div className={styles.footer}>
                <button
                    className={`${styles.statButton} ${post.isLikedByMe ? styles.liked : ''}`}
                    onClick={onLike}
                    aria-label="Curtir"
                >
                    <Heart size={20} fill={post.isLikedByMe ? 'currentColor' : 'none'} />
                    {post.likesCount || 0}
                </button>
                <Link to={`/posts/${post.id}#comments`} className={styles.statButton}>
                    <MessageCircle size={20} />
                    {post.commentsCount || 0}
                </Link>
            </div>
        </Card>
    );
};
