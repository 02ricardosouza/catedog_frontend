import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import styles from './AuthShell.module.css';

interface AuthShellProps {
    children: ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
    return (
        <div className={styles.shell}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <Link to="/" className={styles.logo}>
                        <PawPrint size={40} /> Cat & Dog Blog
                    </Link>
                    <p className={styles.tagline}>Conecte, compartilhe e cuide.</p>
                </div>
                <div className={styles.card}>
                    {children}
                </div>
            </div>
        </div>
    );
};
