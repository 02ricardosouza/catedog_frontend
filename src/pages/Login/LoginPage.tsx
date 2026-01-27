import React, { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthShell } from '../../components/layout/AuthShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../services/api';
import { useAuth } from '../../store/auth';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authApi.login(email, password);
            login(data.token, data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                />
                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />
                {error && <div className={styles.error}>{error}</div>}
                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar no blog'}
                </Button>
            </form>
            <p className={styles.footer}>
                Ainda não tem conta na plataforma?{' '}
                <Link to="/register" className={styles.link}>
                    Cadastre-se
                </Link>
            </p>
        </AuthShell>
    );
};
