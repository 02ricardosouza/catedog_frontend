import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, UserX, Users, FileText } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import type { UserManagement } from '../../types';
import styles from './AdminPage.module.css';

export const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<UserManagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'editors' | 'users'>('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const { adminApi } = await import('../../services/adminApi');
            const usersData = await adminApi.listUsers();

            const transformedUsers: UserManagement[] = usersData.map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                isEditor: u.role === 'editor' || u.role === 'admin',
                isAdmin: u.role === 'admin',
                created_at: u.created_at,
                postsCount: Number.parseInt(u.posts_count) || 0
            }));

            setUsers(transformedUsers);
        } catch (err) {
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEditor = async (userId: number, currentStatus: boolean) => {
        try {
            const { adminApi } = await import('../../services/adminApi');
            const newRole = currentStatus ? 'user' : 'editor';
            await adminApi.updateUserRole(userId, newRole);

            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, isEditor: !currentStatus, role: newRole as any }
                    : user
            ));
        } catch (err) {
            console.error('Error toggling editor status:', err);
            alert('Erro ao atualizar permissões do usuário');
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'editors') return user.isEditor && !user.isAdmin;
        if (filter === 'users') return !user.isEditor && !user.isAdmin;
        return !user.isAdmin; // Não mostra admins na lista
    });

    const stats = {
        total: users.filter(u => !u.isAdmin).length,
        editors: users.filter(u => u.isEditor && !u.isAdmin).length,
        users: users.filter(u => !u.isEditor && !u.isAdmin).length,
        totalPosts: users.reduce((sum, u) => sum + (u.postsCount || 0), 0)
    };

    if (loading) {
        return (
            <AppShell>
                <div className={styles.loading}>Carregando...</div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>
                            <Shield size={32} />
                            Painel de Administração
                        </h1>
                        <p className={styles.subtitle}>Gerencie usuários e permissões do blog</p>
                    </div>
                </div>

                <div className={styles.stats}>
                    <Card className={styles.statCard}>
                        <Users size={24} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>{stats.total}</div>
                            <div className={styles.statLabel}>Total de Usuários</div>
                        </div>
                    </Card>
                    <Card className={styles.statCard}>
                        <UserCheck size={24} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>{stats.editors}</div>
                            <div className={styles.statLabel}>Editores Ativos</div>
                        </div>
                    </Card>
                    <Card className={styles.statCard}>
                        <UserX size={24} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>{stats.users}</div>
                            <div className={styles.statLabel}>Usuários Comuns</div>
                        </div>
                    </Card>
                    <Card className={styles.statCard}>
                        <FileText size={24} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>{stats.totalPosts}</div>
                            <div className={styles.statLabel}>Posts Publicados</div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Gerenciar Usuários</h2>
                        <div className={styles.filters}>
                            <button
                                className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`${styles.filterButton} ${filter === 'editors' ? styles.active : ''}`}
                                onClick={() => setFilter('editors')}
                            >
                                Editores
                            </button>
                            <button
                                className={`${styles.filterButton} ${filter === 'users' ? styles.active : ''}`}
                                onClick={() => setFilter('users')}
                            >
                                Usuários
                            </button>
                        </div>
                    </div>

                    <div className={styles.table}>
                        {filteredUsers.map(user => (
                            <div key={user.id} className={styles.userRow}>
                                <div className={styles.userInfo}>
                                    <Avatar src={undefined} alt={user.name} size="md" />
                                    <div>
                                        <div className={styles.userName}>{user.name}</div>
                                        <div className={styles.userEmail}>{user.email}</div>
                                    </div>
                                </div>

                                <div className={styles.userMeta}>
                                    <div className={styles.badge}>
                                        {user.isEditor ? (
                                            <span className={styles.editorBadge}>
                                                <UserCheck size={14} />
                                                Editor
                                            </span>
                                        ) : (
                                            <span className={styles.userBadge}>
                                                <UserX size={14} />
                                                Usuário
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.postsCount}>
                                        <FileText size={14} />
                                        {user.postsCount || 0} posts
                                    </div>
                                </div>

                                <div className={styles.userActions}>
                                    <Button
                                        variant={user.isEditor ? 'ghost' : 'secondary'}
                                        size="sm"
                                        onClick={() => handleToggleEditor(user.id, user.isEditor)}
                                    >
                                        {user.isEditor ? (
                                            <>
                                                <UserX size={16} />
                                                Remover Editor
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck size={16} />
                                                Tornar Editor
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AppShell>
    );
};
