import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Edit, Trash2, Send, Tag as TagIcon, Star } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { PostSidebar } from '../../components/blog/PostSidebar';
import { commentsApi } from '../../services/api';
import { postsApi } from '../../services/postsApi';
import { useAuth } from '../../store/auth';
import type { Post, Comment } from '../../types';
import styles from './PostDetailPage.module.css';

export const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (id) {
            loadPost();
        }
    }, [id]);

    const loadPost = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const [postData, commentsData, relatedData] = await Promise.all([
                postsApi.getPostById(Number(id)),
                commentsApi.getComments(id),
                postsApi.getPosts().then(posts => posts.slice(0, 5))
            ]);
            setPost(postData);
            setComments(commentsData);
            setRelatedPosts(relatedData);
        } catch (err) {
            console.error('Error loading post:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!id || !post) return;

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await postsApi.toggleLike(Number(id));
            setPost({
                ...post,
                isLikedByMe: !post.isLikedByMe,
                likesCount: (Number(post.likesCount) || 0) + (post.isLikedByMe ? -1 : 1)
            });
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleAddComment = async () => {
        if (!id || !newComment.trim()) return;

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setSubmittingComment(true);
            const comment = await commentsApi.addComment(id, newComment);
            setComments([...comments, comment]);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !globalThis.confirm('Tem certeza que deseja excluir este post?')) return;

        try {
            await postsApi.deletePost(Number(id));
            navigate('/');
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleToggleFeatured = async () => {
        if (!id || !post) return;

        try {
            const updatedPost = await postsApi.setFeatured(Number(id), !post.is_featured);
            setPost(updatedPost);
        } catch (err) {
            console.error('Error toggling featured:', err);
        }
    };

    if (loading) {
        return (
            <AppShell>
                <div className={styles.loading}>Carregando...</div>
            </AppShell>
        );
    }

    if (!post) {
        return (
            <AppShell>
                <div className={styles.error}>Post não encontrado</div>
            </AppShell>
        );
    }

    const isAuthor = user?.id === post.user_id;

    return (
        <AppShell>
            <div className={styles.container}>
                <div className={styles.content}>
                    <Card>
                        <div className={styles.header}>
                            <div className={styles.titleRow}>
                                <h1 className={styles.title}>{post.title}</h1>
                                {post.is_featured && (
                                    <span className={styles.featuredBadge}>
                                        <Star size={14} fill="currentColor" />
                                        Destaque
                                    </span>
                                )}
                            </div>
                            <div className={styles.authorRow}>
                                <div className={styles.authorInfo}>
                                    <Avatar src={post.author?.avatarUrl} alt={post.author?.name || post.author_name || 'User'} size="sm" />
                                    <p className={styles.author}>Por {post.author?.name || post.author_name}</p>
                                </div>
                                {(isAuthor || user?.isAdmin) && (
                                    <div className={styles.actions}>
                                        {isAuthor && (
                                            <>
                                                <Link to={`/posts/${id}/edit`}>
                                                    <Button variant="secondary" size="sm">
                                                        <Edit size={16} />
                                                        Editar
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={handleDelete}>
                                                    <Trash2 size={16} />
                                                    Excluir
                                                </Button>
                                            </>
                                        )}
                                        {user?.isAdmin && (
                                            <Button
                                                variant={post.is_featured ? "primary" : "secondary"}
                                                size="sm"
                                                onClick={handleToggleFeatured}
                                            >
                                                <Star size={16} fill={post.is_featured ? "currentColor" : "none"} />
                                                {post.is_featured ? 'Remover Destaque' : 'Marcar como Destaque'}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.stats}>
                            <button
                                className={`${styles.statButton} ${post.isLikedByMe ? styles.liked : ''}`}
                                onClick={handleLike}
                            >
                                <Heart size={20} fill={post.isLikedByMe ? 'currentColor' : 'none'} />
                                {post.likesCount || 0} curtidas
                            </button>
                            <a href="#comments" className={styles.statButton}>
                                <MessageCircle size={20} />
                                {comments.length} comentários
                            </a>
                        </div>

                        {post.image_url && (
                            <div className={styles.imageContainer}>
                                <img src={post.image_url} alt={post.title} className={styles.image} />
                            </div>
                        )}

                        <div className={styles.body}>
                            <p>{post.content}</p>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                            <div className={styles.hashtags}>
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.name}
                                        className={styles.hashtag}
                                        style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                                    >
                                        <TagIcon size={14} />
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card id="comments">
                        <h3 className={styles.commentsTitle}>
                            <MessageCircle size={24} />
                            Comentários ({comments.length})
                        </h3>

                        {user ? (
                            <div className={styles.addComment}>
                                <Avatar src={user?.avatarUrl} alt={user?.name || 'User'} size="md" />
                                <div className={styles.commentForm}>
                                    <Textarea
                                        placeholder="Adicione um comentário..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows={3}
                                    />
                                    <Button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim() || submittingComment}
                                        size="sm"
                                    >
                                        <Send size={16} />
                                        {submittingComment ? 'Enviando...' : 'Comentar'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.loginPrompt}>
                                <p>Faça login para comentar</p>
                                <Button onClick={() => navigate('/login')} size="sm">
                                    Entrar
                                </Button>
                            </div>
                        )}

                        <div className={styles.commentsList}>
                            {comments.length === 0 ? (
                                <div className={styles.emptyComments}>
                                    <MessageCircle size={48} />
                                    <p>Seja o primeiro a comentar!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className={styles.comment}>
                                        <Avatar
                                            src={comment.author?.avatarUrl}
                                            alt={comment.author?.name || 'User'}
                                            size="md"
                                        />
                                        <div className={styles.commentContent}>
                                            <div className={styles.commentHeader}>
                                                <strong>{comment.author?.name || 'Usuário'}</strong>
                                                <span className={styles.commentDate}>
                                                    {new Date(comment.created_at || Date.now()).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <p>{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                <aside className={styles.sidebar}>
                    <PostSidebar posts={relatedPosts} title="Posts relacionados" />
                </aside>
            </div>
        </AppShell>
    );
};
