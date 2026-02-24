import { useState } from 'react'
import s from './RequestsPage.module.css'

type RequestType = 'sick_leave' | 'annual_leave' | 'shift_swap' | 'emergency'

const myRequests = [
    { id: 1, type: 'sick_leave', dates: 'Feb 20, 2026', status: 'rejected', label: 'Sick Leave', reason: 'Stomach illness.' },
    { id: 2, type: 'shift_swap', dates: 'Feb 18, 2026', status: 'approved', label: 'Shift Swap', reason: 'Requested Sam to cover.' },
]

const statusStyle: Record<string, { color: string; bg: string }> = {
    pending: { color: 'var(--warning)', bg: 'var(--warning-alpha15)' },
    approved: { color: 'var(--success)', bg: 'var(--success-alpha15)' },
    rejected: { color: 'var(--danger)', bg: 'var(--danger-alpha15)' },
}

const requestTypes: { key: RequestType; emoji: string; label: string }[] = [
    { key: 'sick_leave', emoji: '🏥', label: 'Sick Leave' },
    { key: 'annual_leave', emoji: '🏖', label: 'Annual Leave' },
    { key: 'shift_swap', emoji: '🔄', label: 'Shift Swap / Hand-off' },
    { key: 'emergency', emoji: '🚨', label: 'Emergency Leave' },
]

export default function RequestsPage() {
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new')
    const [type, setType] = useState<RequestType>('sick_leave')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')
    const [substituteInfo, setSubstituteInfo] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!reason.trim() || !startDate.trim()) {
            alert('Please fill in all required fields.')
            return
        }
        setSubmitting(true)
        setTimeout(() => {
            setSubmitting(false)
            setSubmitted(true)
            setTimeout(() => { setSubmitted(false); setReason(''); setStartDate(''); setEndDate('') }, 2500)
        }, 1400)
    }

    return (
        <div className={s.page}>
            <h1 className={s.pageTitle}>Requests</h1>

            {/* Tabs */}
            <div className={s.tabs}>
                <button className={`${s.tab} ${activeTab === 'new' ? s.tabActive : ''}`} onClick={() => setActiveTab('new')}>New Request</button>
                <button className={`${s.tab} ${activeTab === 'history' ? s.tabActive : ''}`} onClick={() => setActiveTab('history')}>My History</button>
            </div>

            {activeTab === 'new' ? (
                <form className={s.form} onSubmit={handleSubmit}>
                    {/* Type picker */}
                    <p className={s.sectionLabel}>Request Type</p>
                    <div className={s.typeGrid}>
                        {requestTypes.map((rt) => (
                            <button
                                key={rt.key} type="button"
                                className={`${s.typeCard} ${type === rt.key ? s.typeCardActive : ''}`}
                                onClick={() => setType(rt.key)}
                            >
                                <span className={s.typeEmoji}>{rt.emoji}</span>
                                <span className={`${s.typeLabel} ${type === rt.key ? s.typeLabelActive : ''}`}>{rt.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Dates */}
                    <div className={s.dateRow}>
                        <div className={s.dateInput}>
                            <label className={s.label}>From Date *</label>
                            <input className={s.input} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div className={s.dateInput}>
                            <label className={s.label}>To Date</label>
                            <input className={s.input} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className={s.label}>Reason / Details *</label>
                        <textarea
                            className={s.textarea}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Describe your reason..."
                            required
                        />
                    </div>

                    {/* Shift swap extra field */}
                    {type === 'shift_swap' && (
                        <div>
                            <label className={s.label}>Preferred Substitute (optional)</label>
                            <input
                                className={s.input}
                                value={substituteInfo}
                                onChange={(e) => setSubstituteInfo(e.target.value)}
                                placeholder="e.g. Sam Wilson — can cover from 14:00"
                            />
                            <p className={s.hint}>💡 Management will be notified immediately and can assign a substitute for your remaining shift hours.</p>
                        </div>
                    )}

                    {submitted
                        ? <div className={s.successBox}><p className={s.successText}>✅ Request submitted! Management will review it shortly.</p></div>
                        : <button className={s.submitBtn} type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request →'}</button>
                    }
                </form>
            ) : (
                <div className={s.historyList}>
                    {myRequests.map((req) => (
                        <div key={req.id} className={s.historyCard}>
                            <div className={s.historyHeader}>
                                <p className={s.historyLabel}>{req.label}</p>
                                <span className={s.statusBadge} style={{ color: statusStyle[req.status].color, background: statusStyle[req.status].bg }}>
                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                </span>
                            </div>
                            <p className={s.historyDate}>{req.dates}</p>
                            <p className={s.historyReason}>{req.reason}</p>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ height: 40 }} />
        </div>
    )
}
