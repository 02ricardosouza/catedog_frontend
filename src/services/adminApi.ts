import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminApi = {
    // ===== STATISTICS =====
    async getStats() {
        const response = await axios.get(`${API_URL}/admin/stats`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ===== USER MANAGEMENT =====
    async listUsers() {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async updateUserRole(userId: number, role: string) {
        const response = await axios.put(
            `${API_URL}/admin/users/${userId}/role`,
            { role },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async toggleUserStatus(userId: number, isActive: boolean) {
        const response = await axios.put(
            `${API_URL}/admin/users/${userId}/status`,
            { is_active: isActive },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // ===== POST MODERATION =====
    async listAllPosts() {
        const response = await axios.get(`${API_URL}/admin/posts`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async deletePost(postId: number) {
        const response = await axios.delete(`${API_URL}/admin/posts/${postId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ===== COMMENT MODERATION =====
    async listAllComments() {
        const response = await axios.get(`${API_URL}/admin/comments`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async deleteComment(commentId: number) {
        const response = await axios.delete(`${API_URL}/admin/comments/${commentId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ===== ADMIN LOGS =====
    async getLogs(limit: number = 100) {
        const response = await axios.get(`${API_URL}/admin/logs`, {
            params: { limit },
            headers: getAuthHeader()
        });
        return response.data;
    }
};
