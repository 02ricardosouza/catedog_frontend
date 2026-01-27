import React, { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cat, Dog } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { postsApi } from '../../services/postsApi';
import styles from './PostEditorPage.module.css';

export const PostEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<'Gatos' | 'Cachorros'>('Gatos');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            loadPost();
        }
    }, [id]);

    const loadPost = async () => {
        if (!id) return;

        try {
            const post = await postsApi.getPostById(Number(id));
            setTitle(post.title);
            setContent(post.content);
            setCategory(post.category);
            setImageUrl(post.image_url || '');
            setTags(post.tags?.map((t: any) => typeof t === 'string' ? t : t.name).join(' ') || post.hashtags?.join(' ') || '');
        } catch (err) {
            console.error('Erro ao carregar post:', err);
            setError('Erro ao carregar post');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!title.trim() || !content.trim()) {
            setError('Título e conteúdo são obrigatórios');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                title,
                content,
                category,
                image_url: imageUrl || undefined,
                tags: tags.split(/[\s,]+/).map(t => t.replace(/^#/, '')).filter(Boolean),
            };

            if (isEditing && id) {
                await postsApi.updatePost(Number(id), payload);
                navigate(`/posts/${id}`);
            } else {
                const newPost = await postsApi.createPost(payload);
                navigate(`/posts/${newPost.id}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar post');
        } finally {
            setLoading(false);
        }
    };

    let submitButtonText = 'Publicar';
    if (loading) {
        submitButtonText = 'Salvando...';
    } else if (isEditing) {
        submitButtonText = 'Salvar alterações';
    }

    return (
        <AppShell>
            <div className={styles.container}>
                <Card>
                    <h1 className={styles.title}>{isEditing ? 'Editar Post' : 'Novo Post'}</h1>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="Título *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite o título do post"
                            required
                        />

                        <fieldset className={styles.radioGroup}>
                            <legend className={styles.radioLabel}>Categoria *</legend>
                            <div className={styles.radios}>
                                <label className={styles.radio}>
                                    <input
                                        type="radio"
                                        value="Gatos"
                                        checked={category === 'Gatos'}
                                        onChange={(e) => setCategory(e.target.value as 'Gatos')}
                                    />
                                    <span><Cat size={18} /> Gatos</span>
                                </label>
                                <label className={styles.radio}>
                                    <input
                                        type="radio"
                                        value="Cachorros"
                                        checked={category === 'Cachorros'}
                                        onChange={(e) => setCategory(e.target.value as 'Cachorros')}
                                    />
                                    <span><Dog size={18} /> Cachorros</span>
                                </label>
                            </div>
                        </fieldset>

                        <ImageUpload
                            label="Imagem do Post"
                            value={imageUrl}
                            onChange={setImageUrl}
                        />

                        <Input
                            label="Tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="gatos, saude, dicas (separadas por vírgula ou espaço)"
                        />

                        <Textarea
                            label="Conteúdo *"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escreva o conteúdo do seu post..."
                            required
                            rows={12}
                        />

                        <div className={styles.actions}>
                            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {submitButtonText}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppShell>
    );
};
