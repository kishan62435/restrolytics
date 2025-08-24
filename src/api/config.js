
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}