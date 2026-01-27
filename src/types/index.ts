export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: 'visitor' | 'user' | 'editor' | 'admin';
    isEditor?: boolean;
    isAdmin?: boolean;
    created_at?: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    category: 'Gatos' | 'Cachorros';
    image_url?: string;
    hashtags?: string[];
    tags?: { name: string; color: string }[];
    author_name?: string;
    author?: User;
    user_id?: number;
    likesCount?: number;
    commentsCount?: number;
    isLikedByMe?: boolean;
    is_featured?: boolean;
    featured_at?: string;
    status?: 'pending' | 'approved' | 'rejected';
    reviewed_by?: number;
    reviewed_at?: string;
    rejection_reason?: string;
    reviewer_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Comment {
    id: number;
    content: string;
    author: User;
    post_id: number;
    created_at?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface UserManagement {
    id: number;
    name: string;
    email: string;
    role: 'visitor' | 'user' | 'editor' | 'admin';
    isEditor: boolean;
    isAdmin: boolean;
    created_at: string;
    postsCount?: number;
}
