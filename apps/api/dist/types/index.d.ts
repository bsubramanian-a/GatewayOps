export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'viewer';
    api_key: string;
    created_at: string;
}
export interface Service {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: 'healthy' | 'degraded' | 'down';
    base_url?: string;
    created_at: string;
}
export interface ApiLog {
    id: string;
    service_id: string;
    user_id?: string;
    endpoint: string;
    method: string;
    status_code: number;
    latency_ms: number;
    request_size?: number;
    response_size?: number;
    ip_address?: string;
    user_agent?: string;
    error_message?: string;
    created_at: string;
}
export interface AuthEvent {
    id: string;
    user_id?: string;
    event_type: 'login_success' | 'login_failure' | 'failed_login' | 'token_invalid' | 'token_expired';
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
    created_at: string;
}
export interface RateLimitViolation {
    id: string;
    user_id?: string;
    service_id?: string;
    endpoint?: string;
    request_count: number;
    window_start: string;
    window_end: string;
    created_at: string;
}
//# sourceMappingURL=index.d.ts.map