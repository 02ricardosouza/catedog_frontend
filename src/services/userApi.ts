import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    posts_count: number;
    followers_count: number;
    following_count: number;
    isFollowing: boolean;
}

export interface FollowUser {
    id: number;
    name: string;
    followed_at: string;
}

export const userApi = {
    getProfile: async (userId: number): Promise<UserProfile> => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    getUserPosts: async (userId: number) => {
        const response = await api.get(`/users/${userId}/posts`);
        return response.data;
    },

    getFollowers: async (userId: number): Promise<FollowUser[]> => {
        const response = await api.get(`/users/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId: number): Promise<FollowUser[]> => {
        const response = await api.get(`/users/${userId}/following`);
        return response.data;
    },

    toggleFollow: async (userId: number) => {
        const response = await api.post(`/users/${userId}/follow`);
        return response.data;
    }
};
