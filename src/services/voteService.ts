import { fetchJson } from './api';
import type { Vote, VoteStatus, Candidate, User } from '../types';

// Cache users to avoid repeated API calls
let cachedUsers: User[] | null = null;

async function getUsers(): Promise<User[]> {
    if (!cachedUsers) {
        try {
            cachedUsers = await fetchJson<User[]>('/api/users');
        } catch {
            cachedUsers = [];
        }
    }
    return cachedUsers;
}

// Clear cache on logout or when needed
export function clearUserCache() {
    cachedUsers = null;
}

export const voteService = {
    async upsertMarks(candidateId: number, userId: number, marks: number): Promise<void> {
        await fetchJson<Vote>('/api/votes', {
            method: 'POST',
            body: JSON.stringify({ candidateId, userId, marks })
        });
    },

    async statusForCandidate(candidateId: number): Promise<VoteStatus[]> {
        // Fetch users and votes
        const [users, votes] = await Promise.all([
            getUsers(),
            fetchJson<Vote[]>(`/api/votes/candidate/${candidateId}`)
        ]);

        // Create a map of votes by userId
        const voteMap = new Map<number, Vote>();
        votes.forEach(v => voteMap.set(v.userId, v));

        // Return vote status for all members (not admin)
        return users
            .filter(u => u.role === 'member')
            .map(u => {
                const vote = voteMap.get(u.id!);
                return {
                    userId: u.id!,
                    fullName: u.fullName,
                    username: u.username,
                    role: u.role,
                    marks: vote?.marks ?? null,
                    submittedAt: vote?.submittedAt || null
                };
            });
    },

    async countSubmitted(candidateId: number): Promise<{ totalMembers: number; submittedMembers: number }> {
        const [users, votes] = await Promise.all([
            getUsers(),
            fetchJson<Vote[]>(`/api/votes/candidate/${candidateId}`)
        ]);
        const memberCount = users.filter(u => u.role === 'member').length;
        return {
            totalMembers: memberCount,
            submittedMembers: votes.length
        };
    },

    async marksMap(
        candidates: Candidate[],
        members: User[]
    ): Promise<Map<string, number | null>> {
        const map = new Map<string, number | null>();

        await Promise.all(candidates.map(async (c) => {
            try {
                const votes = await fetchJson<Vote[]>(`/api/votes/candidate/${c.id}`);
                for (const v of votes) {
                    map.set(`${v.candidateId}:${v.userId}`, v.marks);
                }
            } catch (err) {
                console.error(`Failed to fetch votes for candidate ${c.id}:`, err);
            }
        }));

        return map;
    },

    async totalsByCandidate(
        candidates: Candidate[]
    ): Promise<Map<number, { totalMarks: number; totalVotes: number }>> {
        const map = new Map<number, { totalMarks: number; totalVotes: number }>();

        await Promise.all(candidates.map(async (c) => {
            try {
                const votes = await fetchJson<Vote[]>(`/api/votes/candidate/${c.id}`);
                const totalMarks = votes.reduce((sum, v) => sum + (v.marks || 0), 0);
                map.set(c.id!, {
                    totalMarks,
                    totalVotes: votes.length
                });
            } catch (err) {
                console.error(`Failed to fetch votes for candidate ${c.id}:`, err);
                map.set(c.id!, { totalMarks: 0, totalVotes: 0 });
            }
        }));

        return map;
    },

    async deleteByCandidate(candidateId: number): Promise<void> {
        await fetchJson(`/api/votes/candidate/${candidateId}`, {
            method: 'DELETE'
        });
    },

    async getVoteForUser(candidateId: number, userId: number): Promise<Vote | undefined> {
        const votes = await fetchJson<Vote[]>(`/api/votes/candidate/${candidateId}`);
        return votes.find(v => v.userId === userId);
    }
};
