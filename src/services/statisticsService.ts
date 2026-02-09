import { API_BASE, fetchJson } from './api';

export interface BranchStats {
    total: number;
    reviewed: number;
}

export interface Statistics {
    [branch: string]: BranchStats;
}

export async function getStatistics(): Promise<Statistics> {
    return fetchJson(`/api/candidates/statistics`);
}

export async function getBranches(): Promise<string[]> {
    return fetchJson(`/api/candidates/branches`);
}

export async function getCandidatesByBranch(branch: string, timers?: number[]): Promise<any[]> {
    let url = `/api/candidates?branch=${branch}`;
    if (timers && timers.length > 0) {
        url += `&timers=${timers.join(',')}`;
    }
    return fetchJson(url);
}

export async function markAsReviewed(id: number): Promise<void> {
    await fetch(`${API_BASE}/api/candidates/${id}/reviewed`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
}
