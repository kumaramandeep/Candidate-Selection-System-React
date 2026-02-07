export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    // Add token if exists (for Phase 2 security)
    const user = sessionStorage.getItem('user');
    if (user) {
        const parsed = JSON.parse(user);
        if (parsed.token) {
            // headers['Authorization'] = `Bearer ${parsed.token}`;
        }
    }
    return headers;
};

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : (undefined as unknown as T);
}
