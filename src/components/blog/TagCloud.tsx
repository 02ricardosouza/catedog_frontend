import React, { useState, useEffect } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { postsApi } from '../../services/postsApi';
import styles from './TagCloud.module.css';

interface Tag {
    name: string;
    color: string;
    post_count: number;
}

interface TagCloudProps {
    onTagSelect: (tag: string | null) => void;
    selectedTag: string | null;
}

export const TagCloud: React.FC<TagCloudProps> = ({ onTagSelect, selectedTag }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const data = await postsApi.getTopTags();
            setTags(data);
        } catch (error) {
            console.error('Erro ao carregar tags:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Carregando tags...</div>;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Tags Populares</h3>
            <div className={styles.cloud}>
                <button
                    className={`${styles.tag} ${selectedTag ? '' : styles.active}`}
                    onClick={() => onTagSelect(null)}
                >
                    Todas
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.name}
                        className={`${styles.tag} ${selectedTag === tag.name ? styles.active : ''}`}
                        onClick={() => onTagSelect(tag.name)}
                        style={selectedTag === tag.name ? { backgroundColor: tag.color, borderColor: tag.color, color: '#fff' } : { color: tag.color, backgroundColor: `${tag.color}15` }}
                    >
                        <TagIcon size={12} />
                        {tag.name}
                        <span className={styles.count} style={selectedTag === tag.name ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' } : { backgroundColor: `${tag.color}20`, color: tag.color }}>
                            {tag.post_count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
