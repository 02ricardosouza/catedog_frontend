import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postsApi = {
    async getPosts(category?: string, tag?: string, limit?: number, offset?: number) {
        const response = await axios.get(`${API_URL}/posts`, {
            params: { category, tag, limit, offset },
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getTopTags(limit: number = 10) {
        const response = await axios.get(`${API_URL}/tags/top`, {
            params: { limit }
        });
        return response.data;
    },

    async getFeaturedPost() {
        const response = await axios.get(`${API_URL}/posts/featured`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getRecentPosts(limit: number = 3) {
        const response = await axios.get(`${API_URL}/posts/recent`, {
            params: { limit },
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getPostById(id: number) {
        const response = await axios.get(`${API_URL}/posts/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getMostLikedPosts(limit: number = 5) {
        const response = await axios.get(`${API_URL}/posts/most-liked`, {
            params: { limit }
        });
        return response.data;
    },

    async toggleLike(postId: number) {
        const response = await axios.post(
            `${API_URL}/posts/${postId}/like`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async createPost(postData: any) {
        const response = await axios.post(`${API_URL}/posts`, postData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async updatePost(id: number, postData: any) {
        const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async setFeatured(id: number, isFeatured: boolean) {
        const response = await axios.put(
            `${API_URL}/posts/${id}/featured`,
            { is_featured: isFeatured },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async deletePost(id: number) {
        const response = await axios.delete(`${API_URL}/posts/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getMyPosts() {
        const response = await axios.get(`${API_URL}/posts/my-posts`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Moderation methods
    async getPendingPosts() {
        const response = await axios.get(`${API_URL}/posts/pending`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getPostsByStatus(status: 'pending' | 'approved' | 'rejected') {
        const response = await axios.get(`${API_URL}/posts/by-status`, {
            params: { status },
            headers: getAuthHeader()
        });
        return response.data;
    },

    async approvePost(id: number) {
        const response = await axios.put(
            `${API_URL}/posts/${id}/approve`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async rejectPost(id: number, reason: string) {
        const response = await axios.put(
            `${API_URL}/posts/${id}/reject`,
            { reason },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async search(query: string) {
        const response = await axios.get(`${API_URL}/posts/search`, {
            params: { q: query },
            headers: getAuthHeader()
        });
        return response.data;
    }
};
