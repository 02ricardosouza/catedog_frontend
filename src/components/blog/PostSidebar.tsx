import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { Post } from '../../types';
import styles from './PostSidebar.module.css';

interface PostSidebarProps {
    posts: Post[];
    title: string;
}

export const PostSidebar: React.FC<PostSidebarProps> = ({ posts, title }) => {
    return (
        <div className={styles.sidebar}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.posts}>
                {posts.map((post) => (
                    <Link to={`/posts/${post.id}`} key={post.id} className={styles.postLink}>
                        <Card padding="sm" className={styles.postCard}>
                            {post.image_url && (
                                <div className={styles.thumbnail}>
                                    <img src={post.image_url} alt={post.title} />
                                </div>
                            )}
                            <div className={styles.postContent}>
                                <h4 className={styles.postTitle}>{post.title}</h4>
                                <div className={styles.stats}>
                                    <span>❤️ {post.likesCount || 0}</span>
                                    <span>💬 {post.commentsCount || 0}</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};
