import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { postsApi } from '../../services/postsApi';
import type { Post } from '../../types';
import styles from './ModerationPage.module.css';

type TabType = 'pending' | 'approved' | 'rejected';

export const ModerationPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [rejectingPostId, setRejectingPostId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        loadPosts();
    }, [activeTab]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await postsApi.getPostsByStatus(activeTab);
            setPosts(data);
        } catch (err) {
            console.error('Erro ao carregar posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (postId: number) => {
        try {
            setActionLoading(postId);
            await postsApi.approvePost(postId);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (err) {
            console.error('Erro ao aprovar post:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (postId: number) => {
        if (!rejectionReason.trim()) {
            return;
        }

        try {
            setActionLoading(postId);
            await postsApi.rejectPost(postId, rejectionReason);
            setPosts(posts.filter(p => p.id !== postId));
            setRejectingPostId(null);
            setRejectionReason('');
        } catch (err) {
            console.error('Erro ao rejeitar post:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const tabs = [
        { id: 'pending' as TabType, label: 'Pendentes', icon: Clock, count: 0 },
        { id: 'approved' as TabType, label: 'Aprovados', icon: CheckCircle, count: 0 },
        { id: 'rejected' as TabType, label: 'Rejeitados', icon: XCircle, count: 0 },
    ];

    return (
        <AppShell>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        <AlertCircle size={28} />
                        Moderação de Posts
                    </h1>
                    <p className={styles.subtitle}>
                        Revise e aprove posts antes de serem publicados
                    </p>
                </div>

                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className={styles.loading}>Carregando...</div>
                ) : posts.length === 0 ? (
                    <div className={styles.empty}>
                        <Clock size={48} />
                        <p>Nenhum post {activeTab === 'pending' ? 'pendente' : activeTab === 'approved' ? 'aprovado' : 'rejeitado'}</p>
                    </div>
                ) : (
                    <div className={styles.postsList}>
                        {posts.map((post) => (
                            <Card key={post.id} className={styles.postCard}>
                                <div className={styles.postHeader}>
                                    <div className={styles.authorInfo}>
                                        <Avatar
                                            src={post.author?.avatarUrl}
                                            alt={post.author?.name || post.author_name || 'User'}
                                            size="md"
                                        />
                                        <div>
                                            <span className={styles.authorName}>
                                                {post.author?.name || post.author_name}
                                            </span>
                                            <span className={styles.postDate}>
                                                {new Date(post.created_at || Date.now()).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles[post.status || 'pending']}`}>
                                        {post.status === 'pending' && <Clock size={14} />}
                                        {post.status === 'approved' && <CheckCircle size={14} />}
                                        {post.status === 'rejected' && <XCircle size={14} />}
                                        {post.status === 'pending' ? 'Pendente' : post.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                    </span>
                                </div>

                                <div className={styles.postContent}>
                                    <h3 className={styles.postTitle}>{post.title}</h3>
                                    <p className={styles.postExcerpt}>
                                        {post.content.substring(0, 200)}
                                        {post.content.length > 200 && '...'}
                                    </p>
                                    {post.image_url && (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className={styles.postImage}
                                        />
                                    )}
                                </div>

                                {post.rejection_reason && (
                                    <div className={styles.rejectionReason}>
                                        <strong>Motivo da rejeição:</strong> {post.rejection_reason}
                                    </div>
                                )}

                                {post.reviewer_name && (
                                    <div className={styles.reviewerInfo}>
                                        Revisado por <strong>{post.reviewer_name}</strong> em{' '}
                                        {new Date(post.reviewed_at || Date.now()).toLocaleDateString('pt-BR')}
                                    </div>
                                )}

                                <div className={styles.postActions}>
                                    <Link to={`/posts/${post.id}`}>
                                        <Button variant="secondary" size="sm">
                                            <Eye size={16} />
                                            Ver Post
                                        </Button>
                                    </Link>

                                    {activeTab === 'pending' && (
                                        <>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleApprove(post.id)}
                                                disabled={actionLoading === post.id}
                                            >
                                                <Check size={16} />
                                                Aprovar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setRejectingPostId(post.id)}
                                                disabled={actionLoading === post.id}
                                            >
                                                <X size={16} />
                                                Rejeitar
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {rejectingPostId === post.id && (
                                    <div className={styles.rejectModal}>
                                        <textarea
                                            className={styles.rejectTextarea}
                                            placeholder="Informe o motivo da rejeição..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                        <div className={styles.rejectActions}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setRejectingPostId(null);
                                                    setRejectionReason('');
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleReject(post.id)}
                                                disabled={!rejectionReason.trim() || actionLoading === post.id}
                                            >
                                                Confirmar Rejeição
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
};
