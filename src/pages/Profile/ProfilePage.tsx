import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { useAuth } from '../../store/auth';
import styles from './ProfilePage.module.css';
import { userApi, type FollowUser, type UserProfile } from '../../services/userApi';

type TabType = 'posts' | 'followers' | 'following';

interface Post {
    id: number;
    title: string;
    image_url?: string;
    category: string;
    created_at: string;
    likes_count?: number;
    comments_count?: number;
}

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('posts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [followLoading, setFollowLoading] = useState(false);

    const userId = Number.parseInt(id || '0');
    const isOwnProfile = currentUser?.id === userId;

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId]);

    useEffect(() => {
        if (activeTab === 'posts' && posts.length === 0) {
            loadPosts();
        } else if (activeTab === 'followers' && followers.length === 0) {
            loadFollowers();
        } else if (activeTab === 'following' && following.length === 0) {
            loadFollowing();
        }
    }, [activeTab]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await userApi.getProfile(userId);
            setProfile(data);
            await loadPosts();
        } catch (err) {
            setError('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        try {
            const data = await userApi.getUserPosts(userId);
            setPosts(data);
        } catch (err) {
            console.error('Error loading posts:', err);
        }
    };

    const loadFollowers = async () => {
        try {
            const data = await userApi.getFollowers(userId);
            setFollowers(data);
        } catch (err) {
            console.error('Error loading followers:', err);
        }
    };

    const loadFollowing = async () => {
        try {
            const data = await userApi.getFollowing(userId);
            setFollowing(data);
        } catch (err) {
            console.error('Error loading following:', err);
        }
    };

    const handleToggleFollow = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setFollowLoading(true);
            const result = await userApi.toggleFollow(userId);
            setProfile(prev => prev ? {
                ...prev,
                isFollowing: result.following,
                followers_count: result.following
                    ? prev.followers_count + 1
                    : prev.followers_count - 1
            } : null);
        } catch (err) {
            console.error('Error toggling follow:', err);
        } finally {
            setFollowLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <AppShell>
                <div className={styles.profileContainer}>
                    <div className={styles.loading}>Carregando...</div>
                </div>
            </AppShell>
        );
    }

    if (error || !profile) {
        return (
            <AppShell>
                <div className={styles.profileContainer}>
                    <div className={styles.error}>{error || 'Perfil não encontrado'}</div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatar}>
                            {getInitials(profile.name)}
                        </div>
                        <div className={styles.userDetails}>
                            <h1 className={styles.userName}>{profile.name}</h1>
                            <p className={styles.userEmail}>{profile.email}</p>
                            <div className={styles.userMeta}>
                                <span className={styles.roleBadge}>{profile.role}</span>
                                <span>Membro desde {formatDate(profile.created_at)}</span>
                            </div>

                            {!isOwnProfile && (
                                <button
                                    className={`${styles.followButton} ${profile.isFollowing ? styles.following : styles.notFollowing}`}
                                    onClick={handleToggleFollow}
                                    disabled={followLoading}
                                    style={{ marginTop: 'var(--space-4)' }}
                                >
                                    {followLoading ? '...' : profile.isFollowing ? 'Seguindo' : 'Seguir'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.stats}>
                        <div
                            className={styles.statItem}
                            onClick={() => setActiveTab('posts')}
                        >
                            <div className={styles.statValue}>{profile.posts_count}</div>
                            <div className={styles.statLabel}>Posts</div>
                        </div>
                        <div
                            className={styles.statItem}
                            onClick={() => setActiveTab('followers')}
                        >
                            <div className={styles.statValue}>{profile.followers_count}</div>
                            <div className={styles.statLabel}>Seguidores</div>
                        </div>
                        <div
                            className={styles.statItem}
                            onClick={() => setActiveTab('following')}
                        >
                            <div className={styles.statValue}>{profile.following_count}</div>
                            <div className={styles.statLabel}>Seguindo</div>
                        </div>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'followers' ? styles.active : ''}`}
                        onClick={() => setActiveTab('followers')}
                    >
                        Seguidores
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'following' ? styles.active : ''}`}
                        onClick={() => setActiveTab('following')}
                    >
                        Seguindo
                    </button>
                </div>

                {activeTab === 'posts' && (
                    <div className={styles.postsGrid}>
                        {posts.length === 0 ? (
                            <div className={styles.emptyState}>Nenhum post publicado</div>
                        ) : (
                            posts.map(post => (
                                <div
                                    key={post.id}
                                    className={styles.postCard}
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                >
                                    {post.image_url && (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className={styles.postImage}
                                        />
                                    )}
                                    <div className={styles.postContent}>
                                        <h3 className={styles.postTitle}>{post.title}</h3>
                                        <div className={styles.postMeta}>
                                            <span>{post.category}</span>
                                            <span>{formatDate(post.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'followers' && (
                    <div className={styles.usersList}>
                        {followers.length === 0 ? (
                            <div className={styles.emptyState}>Nenhum seguidor ainda</div>
                        ) : (
                            followers.map(user => (
                                <div
                                    key={user.id}
                                    className={styles.userItem}
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                    <div className={styles.userAvatar}>
                                        {getInitials(user.name)}
                                    </div>
                                    <div className={styles.userItemInfo}>
                                        <div className={styles.userItemName}>{user.name}</div>
                                        <div className={styles.userItemDate}>
                                            Seguindo desde {formatDate(user.followed_at)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className={styles.usersList}>
                        {following.length === 0 ? (
                            <div className={styles.emptyState}>Não está seguindo ninguém</div>
                        ) : (
                            following.map(user => (
                                <div
                                    key={user.id}
                                    className={styles.userItem}
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                    <div className={styles.userAvatar}>
                                        {getInitials(user.name)}
                                    </div>
                                    <div className={styles.userItemInfo}>
                                        <div className={styles.userItemName}>{user.name}</div>
                                        <div className={styles.userItemDate}>
                                            Seguindo desde {formatDate(user.followed_at)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
