import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { PostCard } from '../../components/blog/PostCard';
import { postsApi } from '../../services/postsApi';
import type { Post } from '../../types';
import styles from './SearchPage.module.css';

export const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const searchPosts = async () => {
            if (!query) {
                setPosts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const results = await postsApi.search(query);
                setPosts(results);
            } catch (err) {
                console.error('Erro na busca:', err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        searchPosts();
    }, [query]);

    return (
        <AppShell>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link to="/" className={styles.backLink}>
                        <ArrowLeft size={20} />
                        Voltar ao Feed
                    </Link>
                    <h1 className={styles.title}>
                        <Search size={28} />
                        Resultados para "{query}"
                    </h1>
                    <p className={styles.subtitle}>
                        {loading
                            ? 'Buscando...'
                            : `${posts.length} resultado${posts.length !== 1 ? 's' : ''} encontrado${posts.length !== 1 ? 's' : ''}`
                        }
                    </p>
                </div>

                {loading ? (
                    <div className={styles.loading}>Buscando posts...</div>
                ) : posts.length === 0 ? (
                    <Card className={styles.emptyCard}>
                        <div className={styles.empty}>
                            <Search size={48} />
                            <h2>Nenhum resultado encontrado</h2>
                            <p>Tente buscar por outros termos ou tags.</p>
                        </div>
                    </Card>
                ) : (
                    <div className={styles.results}>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
};
