// Database is disabled as we moved to Spring Boot Backend
// Keeping file to avoid immediate build errors if imports exist, but it does nothing.

export const db = {} as any;

export async function initializeDatabase(): Promise<void> {
    // No-op
}
