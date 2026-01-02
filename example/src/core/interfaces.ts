export interface ResponseObject {
    status: string,
    msg?: string,
    data?: any
}

export interface AuditEvent {
    event_type: string,
    event: string,
    created_at: string,
    tl_school_id: number,
    tl_user_id: number
}

export interface UserPayload {
    type: string,
    username: string,
    userId: number
}