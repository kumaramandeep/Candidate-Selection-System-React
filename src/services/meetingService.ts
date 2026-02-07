import { fetchJson } from './api';
import type { MeetingState } from '../types';

export const meetingService = {
    async getState(): Promise<MeetingState> {
        return fetchJson<MeetingState>('/meeting');
    },

    async setCurrentCandidate(candidateId: number | null): Promise<void> {
        await fetchJson<MeetingState>(`/meeting/candidate/${candidateId || 0}`, {
            method: 'POST'
        });
    },

    async openVote(): Promise<void> {
        await fetchJson<MeetingState>('/meeting/vote/open', {
            method: 'POST'
        });
    },

    async closeVote(): Promise<void> {
        await fetchJson<MeetingState>('/meeting/vote/close', {
            method: 'POST'
        });
    }
};
