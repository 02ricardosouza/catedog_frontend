import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Clock, Heart, MessageCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { postsApi } from '../../services/postsApi';
import type { Post } from '../../types';
import styles from './MyPostsPage.module.css';

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    switch (status) {
        case 'approved':
            return (
                <span className={`${styles.badge} ${styles.badgeApproved}`}>
                    <CheckCircle size={14} />
                    Aprovado
                </span>
            );
        case 'rejected':
            return (
                <span className={`${styles.badge} ${styles.badgeRejected}`}>
                    <XCircle size={14} />
                    Rejeitado
                </span>
            );
        case 'pending':
        default:
            return (
                <span className={`${styles.badge} ${styles.badgePending}`}>
                    <AlertCircle size={14} />
                    Pendente
                </span>
            );
    }
};

export const MyPostsPage: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        loadMyPosts();
    }, []);

    const loadMyPosts = async () => {
        try {
            setLoading(true);
            const data = await postsApi.getMyPosts();
            setPosts(data);
        } catch (err: any) {
            console.error('Erro ao carregar posts:', err);
            setError('Erro ao carregar suas postagens');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!globalThis.confirm('Tem certeza que deseja excluir esta postagem?')) {
            return;
        }

        try {
            setDeletingId(id);
            await postsApi.deletePost(id);
            setPosts(posts.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erro ao excluir post:', err);
            alert('Erro ao excluir postagem');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <AppShell>
                <div className={styles.loading}>Carregando suas postagens...</div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Minhas Postagens</h1>
                        <p className={styles.subtitle}>
                            Gerencie todas as suas publicações
                        </p>
                    </div>
                    <Button onClick={() => navigate('/posts/new')}>
                        <Plus size={18} />
                        Nova Postagem
                    </Button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {posts.length === 0 ? (
                    <Card>
                        <div className={styles.empty}>
                            <h3>Você ainda não tem postagens</h3>
                            <p>Crie sua primeira postagem para compartilhar com a comunidade!</p>
                            <Button onClick={() => navigate('/posts/new')}>
                                <Plus size={18} />
                                Criar Primeira Postagem
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className={styles.postsList}>
                        <div className={styles.statsBar}>
                            <span>Total: {posts.length} postagens</span>
                            <span>Aprovadas: {posts.filter(p => p.status === 'approved').length}</span>
                            <span>Pendentes: {posts.filter(p => p.status === 'pending').length}</span>
                            <span>Rejeitadas: {posts.filter(p => p.status === 'rejected').length}</span>
                        </div>

                        {posts.map((post) => (
                            <Card key={post.id} className={styles.postCard}>
                                <div className={styles.postContent}>
                                    {post.image_url && (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className={styles.thumbnail}
                                        />
                                    )}
                                    <div className={styles.postInfo}>
                                        <div className={styles.postHeader}>
                                            <h3 className={styles.postTitle}>
                                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                                            </h3>
                                            <StatusBadge status={post.status} />
                                        </div>
                                        <p className={styles.postExcerpt}>
                                            {post.content.substring(0, 150)}...
                                        </p>
                                        <div className={styles.postMeta}>
                                            <span className={styles.category}>{post.category}</span>
                                            <span className={styles.date}>
                                                <Clock size={14} />
                                                {formatDate(post.created_at)}
                                            </span>
                                            <span className={styles.stat}>
                                                <Heart size={14} />
                                                {post.likesCount || 0}
                                            </span>
                                            <span className={styles.stat}>
                                                <MessageCircle size={14} />
                                                {post.commentsCount || 0}
                                            </span>
                                        </div>
                                        {post.status === 'rejected' && post.rejection_reason && (
                                            <div className={styles.rejectionReason}>
                                                <strong>Motivo da rejeição:</strong> {post.rejection_reason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.postActions}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                        title="Visualizar"
                                    >
                                        <Eye size={18} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(post.id)}
                                        disabled={deletingId === post.id}
                                        title="Excluir"
                                        className={styles.deleteBtn}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
};
