import { create } from 'zustand'

export interface Employee {
    id: string
    name: string
    role: string
    email: string
    hourly_rate: number
    avatar_initials: string
}

export interface AttendanceState {
    isSignedIn: boolean
    signInTime: string | null
    isOnBreak: boolean
    breakStartTime: string | null
    attendanceId: string | null
    todayHours: number
}

interface AppStore {
    // Auth
    employee: Employee | null
    token: string | null
    setEmployee: (emp: Employee | null) => void
    setToken: (t: string | null) => void
    logout: () => void

    // Attendance
    attendance: AttendanceState
    signIn: () => void
    signOut: () => void
    startBreak: () => void
    endBreak: () => void

    // GPS
    isInGeofence: boolean
    setIsInGeofence: (val: boolean) => void
    restaurantLat: number
    restaurantLng: number
    geofenceRadius: number

    // Notifications
    unreadCount: number
    incrementUnread: () => void
    clearUnread: () => void
}

export const useStore = create<AppStore>((set, get) => ({
    // Auth
    employee: null,
    token: null,
    setEmployee: (emp) => set({ employee: emp }),
    setToken: (token) => set({ token }),
    logout: () => set({ employee: null, token: null }),

    // Attendance
    attendance: {
        isSignedIn: false,
        signInTime: null,
        isOnBreak: false,
        breakStartTime: null,
        attendanceId: null,
        todayHours: 0,
    },
    signIn: () =>
        set({
            attendance: {
                isSignedIn: true,
                signInTime: new Date().toISOString(),
                isOnBreak: false,
                breakStartTime: null,
                attendanceId: `att-${Date.now()}`,
                todayHours: 0,
            },
        }),
    signOut: () => {
        const { attendance } = get()
        const hours = attendance.signInTime
            ? (Date.now() - new Date(attendance.signInTime).getTime()) / 3600000
            : 0
        set({
            attendance: {
                isSignedIn: false,
                signInTime: null,
                isOnBreak: false,
                breakStartTime: null,
                attendanceId: null,
                todayHours: Math.round(hours * 10) / 10,
            },
        })
    },
    startBreak: () =>
        set((s) => ({
            attendance: { ...s.attendance, isOnBreak: true, breakStartTime: new Date().toISOString() },
        })),
    endBreak: () =>
        set((s) => ({
            attendance: { ...s.attendance, isOnBreak: false, breakStartTime: null },
        })),

    // GPS — configure to your restaurant's location
    isInGeofence: false,
    setIsInGeofence: (val) => set({ isInGeofence: val }),
    restaurantLat: 40.7128,  // Replace with actual restaurant lat
    restaurantLng: -74.006,  // Replace with actual restaurant lng
    geofenceRadius: 100,      // meters

    // Notifications
    unreadCount: 2,
    incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
    clearUnread: () => set({ unreadCount: 0 }),
}))
