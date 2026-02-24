import s from './ShiftsPage.module.css'

const shifts = [
    { id: 1, date: 'Mon, Feb 23', day: 'Today', start: '08:00', end: '16:00', role: 'Head Chef', status: 'in_progress', hours: '8h' },
    { id: 2, date: 'Tue, Feb 24', day: 'Tomorrow', start: '08:00', end: '16:00', role: 'Head Chef', status: 'scheduled', hours: '8h' },
    { id: 3, date: 'Wed, Feb 25', day: 'Wednesday', start: '10:00', end: '18:00', role: 'Head Chef', status: 'scheduled', hours: '8h' },
    { id: 4, date: 'Fri, Feb 27', day: 'Friday', start: '09:00', end: '17:00', role: 'Head Chef', status: 'scheduled', hours: '8h' },
    { id: 5, date: 'Sat, Feb 28', day: 'Saturday', start: '12:00', end: '20:00', role: 'Head Chef', status: 'scheduled', hours: '8h' },
    { id: 6, date: 'Mon, Feb 17', day: 'Last Monday', start: '08:00', end: '16:00', role: 'Head Chef', status: 'completed', hours: '8h' },
]

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    in_progress: { color: 'var(--success)', bg: 'var(--success-alpha15)', label: '● In Progress' },
    scheduled: { color: 'var(--info)', bg: 'var(--warning-alpha15)', label: '◎ Upcoming' },
    completed: { color: 'var(--text-muted)', bg: 'var(--bg-card)', label: '✓ Completed' },
    cancelled: { color: 'var(--danger)', bg: 'var(--danger-alpha15)', label: '✕ Cancelled' },
}

export default function ShiftsPage() {
    return (
        <div className={s.page}>
            <h1 className={s.pageTitle}>My Shifts</h1>

            {/* Summary */}
            <div className={s.summaryRow}>
                {[{ v: '40h', l: 'This Week' }, { v: '148h', l: 'This Month' }, { v: '5', l: 'Upcoming' }].map(({ v, l }) => (
                    <div key={l} className={s.summaryCard}>
                        <p className={s.summaryValue}>{v}</p>
                        <p className={s.summaryLabel}>{l}</p>
                    </div>
                ))}
            </div>

            {/* Shift List */}
            <div className={s.shiftList}>
                {shifts.map((shift) => {
                    const cfg = statusConfig[shift.status]
                    return (
                        <div key={shift.id} className={`${s.shiftCard} ${shift.status === 'in_progress' ? s.activeShift : ''}`}>
                            <div className={s.accent} style={{ backgroundColor: cfg.color }} />
                            <div className={s.shiftBody}>
                                <div className={s.shiftHeader}>
                                    <div>
                                        <p className={s.shiftDay}>{shift.day}</p>
                                        <p className={s.shiftDate}>{shift.date}</p>
                                    </div>
                                    <span className={s.statusBadge} style={{ background: cfg.bg, color: cfg.color }}>
                                        {cfg.label}
                                    </span>
                                </div>
                                <div className={s.shiftDetails}>
                                    <p className={s.shiftTime}>🕐 {shift.start} – {shift.end}</p>
                                    <p className={s.shiftRole}>👨‍🍳 {shift.role}</p>
                                    <p className={s.shiftHours}>⏱ {shift.hours}</p>
                                </div>
                                {shift.status === 'scheduled' && (
                                    <button className={s.swapBtn}>🔄 Request Swap / Hand-off</button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div style={{ height: 24 }} />
        </div>
    )
}
