import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { FeedPage } from '../pages/Feed/FeedPage';
import { PostDetailPage } from '../pages/PostDetail/PostDetailPage';
import { PostEditorPage } from '../pages/PostEditor/PostEditorPage';
import { MyPostsPage } from '../pages/MyPosts/MyPostsPage';
import { AdminPage } from '../pages/Admin/AdminPage';
import { ModerationPage } from '../pages/Moderation/ModerationPage';
import { SearchPage } from '../pages/Search/SearchPage';
import ProfilePage from '../pages/Profile/ProfilePage';

const EditorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user?.isEditor && !user?.isAdmin) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user?.isAdmin) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<FeedPage />} />
                <Route path="/posts/:id" element={<PostDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />

                {/* Rotas para editores */}
                <Route
                    path="/my-posts"
                    element={
                        <EditorRoute>
                            <MyPostsPage />
                        </EditorRoute>
                    }
                />
                <Route
                    path="/posts/new"
                    element={
                        <EditorRoute>
                            <PostEditorPage />
                        </EditorRoute>
                    }
                />
                <Route
                    path="/posts/:id/edit"
                    element={
                        <EditorRoute>
                            <PostEditorPage />
                        </EditorRoute>
                    }
                />

                {/* Rotas de administração */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/moderation"
                    element={
                        <AdminRoute>
                            <ModerationPage />
                        </AdminRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};
