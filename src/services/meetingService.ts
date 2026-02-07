import { fetchJson } from './api';
import type { MeetingState } from '../types';

export const meetingService = {
    async getState(): Promise<MeetingState> {
        return fetchJson<MeetingState>('/api/meeting');
    },

    async setCurrentCandidate(candidateId: number | null): Promise<void> {
        await fetchJson<MeetingState>(`/api/meeting/candidate/${candidateId || 0}`, {
            method: 'POST'
        });
    },

    async openVote(): Promise<void> {
        await fetchJson<MeetingState>('/api/meeting/vote/open', {
            method: 'POST'
        });
    },

    async closeVote(): Promise<void> {
        await fetchJson<MeetingState>('/api/meeting/vote/close', {
            method: 'POST'
        });
    }
};
