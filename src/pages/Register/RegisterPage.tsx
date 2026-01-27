import React, { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthShell } from '../../components/layout/AuthShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../services/api';
import { useAuth } from '../../store/auth';
import styles from './RegisterPage.module.css';

export const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await authApi.register(name, email, password);
            // Após registrar, fazer login automático
            const loginData = await authApi.login(email, password);
            login(loginData.token, loginData.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Nome completo"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                />
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
                <Input
                    label="Confirmar senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />
                {error && <div className={styles.error}>{error}</div>}
                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Criando conta...' : 'Cadastrar'}
                </Button>
            </form>
            <p className={styles.footer}>
                Já tem uma conta?{' '}
                <Link to="/login" className={styles.link}>
                    Faça login
                </Link>
            </p>
        </AuthShell>
    );
};
