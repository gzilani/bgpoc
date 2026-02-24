// Shared TypeScript types for the Restaurant Management System

export type UserRole = 'admin' | 'employee'

export interface User {
    id: string
    email: string
    full_name: string
    role: UserRole
    avatar_url?: string
    phone?: string
    position?: string
    hourly_rate?: number
    created_at: string
}

export interface Shift {
    id: string
    employee_id: string
    employee?: User
    start_time: string
    end_time: string
    date: string
    position: string
    notes?: string
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    created_at: string
}

export interface Attendance {
    id: string
    employee_id: string
    shift_id?: string
    sign_in_time?: string
    sign_out_time?: string
    sign_in_method: 'manual' | 'auto_gps'
    sign_out_method?: 'manual' | 'auto_gps'
    sign_in_lat?: number
    sign_in_lng?: number
    sign_out_lat?: number
    sign_out_lng?: number
    total_hours?: number
    date: string
    created_at: string
}

export interface Break {
    id: string
    attendance_id: string
    break_in: string
    break_out?: string
    duration_minutes?: number
    reason?: string
}

export interface Payslip {
    id: string
    employee_id: string
    employee?: User
    period_start: string
    period_end: string
    hours_worked: number
    hourly_rate: number
    gross_pay: number
    tax_amount: number
    other_deductions: number
    net_pay: number
    tax_breakdown: TaxBreakdown
    pdf_url?: string
    status: 'draft' | 'issued'
    issued_at?: string
    created_at: string
}

export interface TaxBreakdown {
    income_tax: number
    national_insurance?: number
    pension?: number
    other?: number
}

export interface LeaveRequest {
    id: string
    employee_id: string
    employee?: User
    type: 'sick_leave' | 'annual_leave' | 'emergency' | 'other'
    start_date: string
    end_date: string
    reason: string
    status: 'pending' | 'approved' | 'rejected'
    admin_notes?: string
    created_at: string
    updated_at: string
}

export interface ShiftSwapRequest {
    id: string
    requesting_employee_id: string
    requesting_employee?: User
    shift_id: string
    shift?: Shift
    substitute_employee_id?: string
    substitute_employee?: User
    reason: string
    hours_remaining: number
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
}

export interface InventoryItem {
    id: string
    name: string
    category: string
    quantity: number
    unit: string
    threshold: number
    supplier_name: string
    supplier_email: string
    supplier_phone?: string
    unit_price?: number
    is_low_stock: boolean
    last_restocked?: string
    created_at: string
    updated_at: string
}

export interface SafetyChecklist {
    id: string
    employee_id: string
    employee?: User
    type: 'maintenance' | 'food_temperature' | 'safety_regulation' | 'cleaning'
    title: string
    items: ChecklistItem[]
    notes?: string
    date: string
    created_at: string
}

export interface ChecklistItem {
    id: string
    label: string
    checked: boolean
    value?: string  // For temperature readings etc.
    notes?: string
}

export interface Notification {
    id: string
    user_id: string
    title: string
    body: string
    type: 'payslip' | 'shift' | 'leave_request' | 'shift_swap' | 'inventory' | 'general'
    read: boolean
    data?: Record<string, unknown>
    created_at: string
}

export interface RestaurantConfig {
    id: string
    name: string
    address: string
    lat: number
    lng: number
    geofence_radius_meters: number
    timezone: string
}
