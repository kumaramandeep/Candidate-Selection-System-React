import { Client, IMessage } from '@stomp/stompjs';
import type { MeetingUpdatePayload, VoteSubmittedPayload } from '../types';

class SocketService {
    private client: Client | null = null;
    private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
    private connected = false;

    connect(_userId?: number, _role?: string): void {
        if (this.client?.active) return;

        // Use current host but ws protocol, or rely on SockJS fallback
        // Since we are proxying, we can point to /ws
        // Use env var for socket url, converting http/https to ws/wss
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const wsUrl = apiUrl.replace(/^http/, 'ws');
        const brokerURL = `${wsUrl}/ws`;

        this.client = new Client({
            brokerURL,
            // Fallback to SockJS if WebSocket fails (handled by proxy usually, but let's stick to standard ws first)
            // Or use webSocketFactory for SockJS support if needed
            onConnect: () => {
                console.log('[stomp] connected');
                this.connected = true;
                this.subscribeToTopics();
            },
            onDisconnect: () => {
                console.log('[stomp] disconnected');
                this.connected = false;
            },
            onStompError: (frame) => {
                console.error('[stomp] error', frame);
            }
        });

        this.client.activate();
    }

    private subscribeToTopics() {
        if (!this.client || !this.client.connected) return;

        this.client.subscribe('/topic/meeting', (message: IMessage) => {
            const data = JSON.parse(message.body) as MeetingUpdatePayload;
            this.notifyListeners('meeting:update', data);
        });

        this.client.subscribe('/topic/votes', (message: IMessage) => {
            const data = JSON.parse(message.body) as VoteSubmittedPayload;
            this.notifyListeners('vote:submitted', data);
        });
    }

    disconnect(): void {
        this.client?.deactivate();
        this.client = null;
        this.connected = false;
    }

    // STOMP sends events to server via /app prefix if we had @MessageMapping
    // But for this app, state changes happen via REST API which then broadcasts to topics
    // So we don't need emit methods here unless we want to send via websocket directly.
    // The previous implementation emitted events to server. 
    // In Spring Boot approach, we usually call REST API to update state, and Server broadcasts.
    // So we'll keep these methods empty or remove them, but to avoid breaking types, we'll leave them as no-ops for now
    // or rely on the services to call REST APIs.

    emitMeetingUpdate(_payload: { currentCandidateId: number | null; voteOpen: boolean }): void {
        // No-op: API call in meetingService handles this
    }

    emitVoteSubmitted(_payload: { candidateId: number; userId: number; marks: number | null }): void {
        // No-op: API call in voteService handles this
    }

    onMeetingUpdate(callback: (data: MeetingUpdatePayload) => void): () => void {
        return this.addListener('meeting:update', callback as (data: unknown) => void);
    }

    onVoteSubmitted(callback: (data: VoteSubmittedPayload) => void): () => void {
        return this.addListener('vote:submitted', callback as (data: unknown) => void);
    }

    private addListener(event: string, callback: (data: unknown) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    private notifyListeners(event: string, data: unknown): void {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }

    isConnected(): boolean {
        return this.connected;
    }
}

export const socketService = new SocketService();
