import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { meetingService } from '../services/meetingService';
import { candidateService } from '../services/candidateService';
import { socketService } from '../services/socketService';
import type { MeetingState, CandidateFull, MeetingUpdatePayload } from '../types';

interface MeetingContextType {
    state: MeetingState | null;
    candidate: CandidateFull | null;
    isLoading: boolean;
    refreshState: () => Promise<void>;
    refreshCandidate: () => Promise<void>;
    goToNextCandidate: () => Promise<boolean>;
    goToPrevCandidate: () => Promise<boolean>;
    setCurrentCandidate: (id: number) => Promise<void>;
    openVote: () => Promise<void>;
    closeVote: () => Promise<void>;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<MeetingState | null>(null);
    const [candidate, setCandidate] = useState<CandidateFull | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshState = useCallback(async () => {
        const newState = await meetingService.getState();
        setState(newState);
        return newState;
    }, []);

    const refreshCandidate = useCallback(async () => {
        if (state?.currentCandidateId) {
            const fullCandidate = await candidateService.getFull(state.currentCandidateId);
            setCandidate(fullCandidate || null);
        } else {
            setCandidate(null);
        }
    }, [state?.currentCandidateId]);

    // Load initial state
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await refreshState();
            setIsLoading(false);
        };
        load();
    }, [refreshState]);

    // Load candidate when state changes
    useEffect(() => {
        if (state?.currentCandidateId) {
            candidateService.getFull(state.currentCandidateId).then(c => setCandidate(c || null));
        } else {
            setCandidate(null);
        }
    }, [state?.currentCandidateId]);

    // Listen for socket updates
    useEffect(() => {
        const unsubscribe = socketService.onMeetingUpdate((data: MeetingUpdatePayload) => {
            setState(prev => prev ? {
                ...prev,
                currentCandidateId: data.currentCandidateId,
                voteOpen: data.voteOpen
            } : null);
        });

        return unsubscribe;
    }, []);

    const goToNextCandidate = async (): Promise<boolean> => {
        if (!state?.currentCandidateId) return false;
        const nextId = await candidateService.getNextId(state.currentCandidateId);
        if (!nextId) return false;

        await meetingService.setCurrentCandidate(nextId);
        const newState = await refreshState();

        // Emit socket event
        socketService.emitMeetingUpdate({
            currentCandidateId: nextId,
            voteOpen: newState.voteOpen
        });

        return true;
    };

    const goToPrevCandidate = async (): Promise<boolean> => {
        if (!state?.currentCandidateId) return false;
        const prevId = await candidateService.getPrevId(state.currentCandidateId);
        if (!prevId) return false;

        await meetingService.setCurrentCandidate(prevId);
        const newState = await refreshState();

        // Emit socket event
        socketService.emitMeetingUpdate({
            currentCandidateId: prevId,
            voteOpen: newState.voteOpen
        });

        return true;
    };

    const setCurrentCandidate = async (id: number): Promise<void> => {
        await meetingService.setCurrentCandidate(id);
        const newState = await refreshState();

        // Emit socket event
        socketService.emitMeetingUpdate({
            currentCandidateId: id,
            voteOpen: newState.voteOpen
        });
    };

    const openVote = async (): Promise<void> => {
        await meetingService.openVote();
        const newState = await refreshState();

        socketService.emitMeetingUpdate({
            currentCandidateId: newState.currentCandidateId,
            voteOpen: true
        });
    };

    const closeVote = async (): Promise<void> => {
        await meetingService.closeVote();
        const newState = await refreshState();

        socketService.emitMeetingUpdate({
            currentCandidateId: newState.currentCandidateId,
            voteOpen: false
        });
    };

    return (
        <MeetingContext.Provider value={{
            state,
            candidate,
            isLoading,
            refreshState,
            refreshCandidate,
            goToNextCandidate,
            goToPrevCandidate,
            setCurrentCandidate,
            openVote,
            closeVote
        }}>
            {children}
        </MeetingContext.Provider>
    );
}

export function useMeeting(): MeetingContextType {
    const context = useContext(MeetingContext);
    if (context === undefined) {
        throw new Error('useMeeting must be used within a MeetingProvider');
    }
    return context;
}
