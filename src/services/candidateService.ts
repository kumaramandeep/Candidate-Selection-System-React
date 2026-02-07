import { fetchJson } from './api';
import type { Candidate, CandidateFull, User } from '../types';

export const candidateService = {
    async listBasic(): Promise<Candidate[]> {
        return fetchJson<Candidate[]>('/api/candidates');
    },

    async getFull(id: number): Promise<CandidateFull | undefined> {
        try {
            return await fetchJson<CandidateFull>(`/api/candidates/${id}`);
        } catch (e) {
            return undefined;
        }
    },

    async create(data: Omit<CandidateFull, 'id'>): Promise<number> {
        const result = await fetchJson<Candidate>('/api/candidates', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return result.id!;
    },

    async update(id: number, data: Partial<CandidateFull>): Promise<void> {
        await fetchJson(`/api/candidates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(id: number): Promise<void> {
        await fetchJson(`/api/candidates/${id}`, {
            method: 'DELETE'
        });
    },

    async getNextId(currentId: number): Promise<number | null> {
        try {
            return await fetchJson<number>(`/api/candidates/${currentId}/next`);
        } catch {
            return null;
        }
    },

    async getPrevId(currentId: number): Promise<number | null> {
        try {
            return await fetchJson<number>(`/api/candidates/${currentId}/prev`);
        } catch {
            return null;
        }
    },

    async updatePhoto(id: number, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/candidates/${id}/photo`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Photo upload failed');
        return await response.text();
    }
};

// User service for member management
export const userService = {
    async listAll(): Promise<User[]> {
        try {
            return await fetchJson<User[]>('/api/users');
        } catch {
            return [];
        }
    },

    async listMembers(): Promise<User[]> {
        try {
            const users = await fetchJson<User[]>('/api/users');
            return users.filter(u => u.role === 'member');
        } catch {
            return [];
        }
    },

    async create(data: {
        fullName: string;
        username: string;
        password: string;
        role: 'admin' | 'member';
    }): Promise<number> {
        const result = await fetchJson<User>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return result.id!;
    }
};
