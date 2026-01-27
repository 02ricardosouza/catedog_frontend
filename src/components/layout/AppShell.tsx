import React, { type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, PlusCircle, Search, Shield, LogIn, Settings, PawPrint, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../../store/auth';
import styles from './AppShell.module.css';

interface AppShellProps {
    children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.logo}>
                        <PawPrint size={24} /> Cat & Dog Blog
                    </Link>

                    <form className={styles.searchContainer} onSubmit={handleSearch}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="search"
                            placeholder="Buscar posts..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className={styles.headerActions}>
                        {isAuthenticated ? (
                            <>
                                {user?.isAdmin && (
                                    <Link to="/admin" className={styles.iconButton} aria-label="Administração" title="Painel Administrativo">
                                        <Settings size={20} />
                                    </Link>
                                )}
                                <button className={styles.iconButton} aria-label="Notificações">
                                    <Bell size={20} />
                                </button>
                                <div className={styles.userMenu}>
                                    <button className={styles.iconButton} aria-label="Menu do usuário">
                                        <User size={20} />
                                        <span>{user?.name}</span>
                                    </button>
                                    <div className={styles.dropdown}>
                                        <Link to={`/profile/${user?.id}`} className={styles.dropdownItem}>
                                            <User size={18} />
                                            Meu Perfil
                                        </Link>
                                        {(user?.isEditor || user?.isAdmin) && (
                                            <>
                                                <Link to="/my-posts" className={styles.dropdownItem}>
                                                    <FileText size={18} />
                                                    Minhas Postagens
                                                </Link>
                                                <Link to="/posts/new" className={styles.dropdownItem}>
                                                    <PlusCircle size={18} />
                                                    Novo Post
                                                </Link>
                                            </>
                                        )}
                                        {user?.isAdmin && (
                                            <>
                                                <Link to="/moderation" className={styles.dropdownItem}>
                                                    <AlertCircle size={18} />
                                                    Moderação
                                                </Link>
                                                <Link to="/admin" className={styles.dropdownItem}>
                                                    <Shield size={18} />
                                                    Administração
                                                </Link>
                                            </>
                                        )}
                                        <button onClick={handleLogout} className={styles.dropdownItem}>
                                            <LogOut size={18} />
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className={styles.loginButton}>
                                <LogIn size={20} />
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles.main}>{children}</main>
        </div>
    );
};
