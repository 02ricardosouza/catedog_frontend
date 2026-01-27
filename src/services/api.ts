import axios from 'axios';
import type { User, Post, Comment, LoginResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    },
    register: async (name: string, email: string, password: string): Promise<User> => {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data;
    },
};

export const postsApi = {
    getFeed: async (params?: { q?: string; category?: string }): Promise<Post[]> => {
        const { data } = await api.get('/posts', { params });
        return data;
    },
    getPostById: async (id: string): Promise<Post> => {
        const { data } = await api.get(`/posts/${id}`);
        return data;
    },
    createPost: async (payload: Partial<Post>): Promise<Post> => {
        const { data } = await api.post('/posts', payload);
        return data;
    },
    updatePost: async (id: string, payload: Partial<Post>): Promise<Post> => {
        const { data } = await api.put(`/posts/${id}`, payload);
        return data;
    },
    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },
    toggleLike: async (postId: string): Promise<{ liked: boolean }> => {
        const { data } = await api.post(`/posts/${postId}/like`);
        return data;
    },
    getLikes: async (postId: string): Promise<{ count: number }> => {
        const { data } = await api.get(`/posts/${postId}/likes`);
        return data;
    },
};

export const commentsApi = {
    getComments: async (postId: string): Promise<Comment[]> => {
        const { data } = await api.get(`/posts/${postId}/comments`);
        return data;
    },
    addComment: async (postId: string, content: string): Promise<Comment> => {
        const { data } = await api.post(`/posts/${postId}/comments`, { content });
        return data;
    },
};

export const usersApi = {
    followUser: async (userId: string): Promise<{ following: boolean }> => {
        const { data } = await api.post(`/users/${userId}/follow`);
        return data;
    },
};
