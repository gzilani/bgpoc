import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { getCurrentLocation } from '../services/gpsService'
import { isWithinGeofence, formatTime } from '@restaurant/shared'
import s from './HomePage.module.css'

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
}

export default function HomePage() {
    const employee = useStore((s) => s.employee)
    const attendance = useStore((s) => s.attendance)
    const isInGeofence = useStore((s) => s.isInGeofence)
    const restaurantLat = useStore((s) => s.restaurantLat)
    const restaurantLng = useStore((s) => s.restaurantLng)
    const geofenceRadius = useStore((s) => s.geofenceRadius)
    const signIn = useStore((s) => s.signIn)
    const signOut = useStore((s) => s.signOut)
    const startBreak = useStore((s) => s.startBreak)
    const endBreak = useStore((s) => s.endBreak)
    const unreadCount = useStore((s) => s.unreadCount)

    const [elapsed, setElapsed] = useState('0h 0m')
    const [breakElapsed, setBreakElapsed] = useState('0m')

    // Live clock for shift duration
    useEffect(() => {
        const id = setInterval(() => {
            if (attendance.signInTime) {
                const diff = Date.now() - new Date(attendance.signInTime).getTime()
                const h = Math.floor(diff / 3600000)
                const m = Math.floor((diff % 3600000) / 60000)
                setElapsed(`${h}h ${m}m`)
            }
            if (attendance.breakStartTime) {
                const diff = Date.now() - new Date(attendance.breakStartTime).getTime()
                setBreakElapsed(`${Math.floor(diff / 60000)}m`)
            }
        }, 10000)
        return () => clearInterval(id)
    }, [attendance.signInTime, attendance.breakStartTime])

    async function handleSignIn() {
        const loc = await getCurrentLocation()
        if (!loc) {
            if (!window.confirm('Could not get your location. Sign in anyway?')) return
            signIn()
            return
        }
        const inZone = isWithinGeofence(loc.lat, loc.lng, restaurantLat, restaurantLng, geofenceRadius)
        if (!inZone) {
            if (window.confirm(`You appear to be outside the restaurant area (${geofenceRadius}m radius). Sign in anyway?`)) {
                signIn()
            }
            return
        }
        signIn()
    }

    function handleBreak() {
        if (attendance.isOnBreak) endBreak()
        else startBreak()
    }

    const quickActions = [
        { emoji: '🏥', label: 'Sick Leave', color: 'var(--danger)' },
        { emoji: '🔄', label: 'Swap Shift', color: 'var(--info)' },
        { emoji: '📋', label: 'Checklist', color: 'var(--success)' },
        { emoji: '📩', label: 'Notifications', color: 'var(--primary)' },
    ]

    return (
        <div className={s.page}>
            {/* Header */}
            <div className={s.header}>
                <div>
                    <p className={s.greeting}>{getGreeting()},</p>
                    <h1 className={s.name}>{employee?.name?.split(' ')[0]} 👋</h1>
                </div>
                <div className={s.avatarWrap}>
                    <div className={s.avatar}>{employee?.avatar_initials}</div>
                    {unreadCount > 0 && <span className={s.badge}>{unreadCount}</span>}
                </div>
            </div>

            {/* GPS Status */}
            <div className={`${s.gpsCard} ${isInGeofence ? s.gpsIn : s.gpsOut}`}>
                <span className={s.gpsIcon}>{isInGeofence ? '📍' : '🔴'}</span>
                <div>
                    <p className={s.gpsTitle} style={{ color: isInGeofence ? 'var(--success)' : 'var(--danger)' }}>
                        {isInGeofence ? 'You are at the restaurant' : 'Outside restaurant area'}
                    </p>
                    <p className={s.gpsSub}>
                        {isInGeofence ? 'GPS auto-attendance is active' : `Must be within ${geofenceRadius}m to auto sign-in`}
                    </p>
                </div>
            </div>

            {/* Attendance Card */}
            <div className={`${s.attendanceCard} ${attendance.isSignedIn ? s.cardSignedIn : ''}`}>
                <div className={s.attendanceTop}>
                    <div>
                        <p className={s.attendanceLabel}>Today's Shift</p>
                        <p className={s.attendanceStatus} style={{
                            color: attendance.isSignedIn
                                ? (attendance.isOnBreak ? 'var(--warning)' : 'var(--success)')
                                : 'var(--text-muted)'
                        }}>
                            {attendance.isSignedIn
                                ? (attendance.isOnBreak ? '🟡 On Break' : '🟢 Signed In')
                                : '⚪ Not Signed In'}
                        </p>
                    </div>
                    {attendance.isSignedIn && (
                        <div className={s.timerBox}>
                            <p className={s.timerValue}>{elapsed}</p>
                            <p className={s.timerLabel}>elapsed</p>
                        </div>
                    )}
                </div>

                {attendance.signInTime && (
                    <div className={s.signInInfo}>
                        <p className={s.signInLabel}>Signed in at</p>
                        <p className={s.signInTime}>{formatTime(attendance.signInTime)}</p>
                        {attendance.isOnBreak && (
                            <div className={s.breakInfo}>
                                <p className={s.breakLabel}>
                                    🟡 Break started at {formatTime(attendance.breakStartTime!)} • {breakElapsed} ago
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <button
                    className={`${s.signBtn} ${attendance.isSignedIn ? s.signBtnOut : s.signBtnIn}`}
                    onClick={attendance.isSignedIn ? signOut : handleSignIn}
                >
                    {attendance.isSignedIn ? '🔴  Sign Out' : '🟢  Sign In'}
                </button>

                {attendance.isSignedIn && (
                    <button className={s.breakBtn} onClick={handleBreak}>
                        {attendance.isOnBreak ? '☕  End Break' : '☕  Take a Break'}
                    </button>
                )}
            </div>

            {/* Info Grid */}
            <div className={s.infoGrid}>
                {[
                    { icon: '📅', value: '8:00–16:00', label: "Today's Shift" },
                    { icon: '💰', value: `$${employee?.hourly_rate}/hr`, label: 'Your Rate' },
                    { icon: '📊', value: '148h', label: 'This Month' },
                ].map((item) => (
                    <div key={item.label} className={s.infoCard}>
                        <span className={s.infoIcon}>{item.icon}</span>
                        <p className={s.infoValue}>{item.value}</p>
                        <p className={s.infoLabel}>{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <p className={s.sectionTitle}>Quick Actions</p>
            <div className={s.quickActions}>
                {quickActions.map((a) => (
                    <button
                        key={a.label}
                        className={s.quickBtn}
                        style={{ borderColor: `${a.color}40` }}
                    >
                        <span className={s.quickBtnEmoji}>{a.emoji}</span>
                        <span className={s.quickBtnLabel} style={{ color: a.color }}>{a.label}</span>
                    </button>
                ))}
            </div>

            <div style={{ height: 24 }} />
        </div>
    )
}
