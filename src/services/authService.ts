import { fetchJson } from './api';
import { socketService } from './socketService';
import type { User, LoginCredentials } from '../types';

const USER_KEY = 'candidate_selection_user';

export const authService = {
    async login(credentials: LoginCredentials): Promise<User> {
        // Phase 2: Call backend login endpoint
        // The backend returns { token, user }
        const response = await fetchJson<{ token: string; user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        const user = response.user;

        // Store user and token (simple session storage for now)
        // In a real app, we'd store token in cookie or memory, and user in context
        // We'll update the stored user to include the token if needed for API interception
        const userWithToken = { ...user, token: response.token };
        sessionStorage.setItem(USER_KEY, JSON.stringify(userWithToken));

        // Connect socket
        socketService.connect(user.id, user.role);

        return user;
    },

    logout(): void {
        sessionStorage.removeItem(USER_KEY);
        socketService.disconnect();
        window.location.href = '/login';
    },

    getCurrentUser(): User | null {
        const stored = sessionStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Helper to initialize session on app load
    initSession(): User | null {
        const user = this.getCurrentUser();
        if (user) {
            socketService.connect(user.id, user.role);
        }
        return user;
    }
};
