import { useState } from 'react'
import s from './SafetyPage.module.css'

type ChecklistType = 'food_temp' | 'safety' | 'maintenance' | 'cleaning'

const TEMPLATES: Record<ChecklistType, { title: string; emoji: string; items: string[] }> = {
    food_temp: {
        title: 'Food Temperature Log', emoji: '🌡',
        items: [
            'Fridge temp (must be ≤ 5°C)',
            'Freezer temp (must be ≤ -18°C)',
            'Hot food holding temp (must be ≥ 63°C)',
            'Cold food display temp (must be ≤ 8°C)',
            'Cooked chicken internal temp (must be ≥ 75°C)',
        ],
    },
    safety: {
        title: 'Safety Regulations Check', emoji: '⚠️',
        items: [
            'Fire extinguishers are accessible',
            'Emergency exits are clear',
            'All staff have food safety certificates',
            'First aid kit is stocked',
            'Wet floor signs available',
            'Cleaning chemicals properly stored',
        ],
    },
    maintenance: {
        title: 'Equipment Maintenance', emoji: '🔧',
        items: [
            'Commercial oven — checked and clean',
            'Deep fryer oil level and temp checked',
            'Dishwasher operating correctly',
            'Refrigeration units working properly',
            'Ventilation/exhaust fan operational',
            'Gas lines — no leaks detected',
        ],
    },
    cleaning: {
        title: 'Cleaning Checklist', emoji: '🧹',
        items: [
            'Kitchen floor mopped and sanitized',
            'Cooking surfaces cleaned',
            'Grease traps cleaned',
            'Toilets and bathrooms cleaned',
            'Tables and chairs sanitized',
            'Bins emptied and replaced',
        ],
    },
}

export default function SafetyPage() {
    const [activeType, setActiveType] = useState<ChecklistType>('food_temp')
    const [checked, setChecked] = useState<Record<string, boolean>>({})
    const [notes, setNotes] = useState<Record<string, string>>({})
    const [tempValues, setTempValues] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const template = TEMPLATES[activeType]
    const completedCount = template.items.filter((_, i) => checked[`${activeType}-${i}`]).length
    const totalCount = template.items.length
    const progress = totalCount > 0 ? completedCount / totalCount : 0

    function toggle(key: string) {
        setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    function handleSubmit() {
        if (completedCount < totalCount) {
            if (!window.confirm(`${totalCount - completedCount} item(s) not yet checked. Submit anyway?`)) return
        }
        setSubmitting(true)
        setTimeout(() => {
            setSubmitting(false)
            setSubmitted(true)
            setChecked({})
            setTimeout(() => setSubmitted(false), 3000)
        }, 1200)
    }

    return (
        <div className={s.page}>
            <h1 className={s.pageTitle}>Safety &amp; Compliance</h1>

            {/* Type selector */}
            <div className={s.typeScroll}>
                {(Object.entries(TEMPLATES) as [ChecklistType, typeof TEMPLATES[ChecklistType]][]).map(([key, t]) => (
                    <button
                        key={key}
                        className={`${s.typeChip} ${activeType === key ? s.typeChipActive : ''}`}
                        onClick={() => setActiveType(key)}
                    >
                        <span>{t.emoji}</span>
                        <span className={`${s.typeChipLabel} ${activeType === key ? s.typeChipLabelActive : ''}`}>
                            {t.title.split(' ')[0]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Progress */}
            <div className={s.progressCard}>
                <div className={s.progressHeader}>
                    <p className={s.progressTitle}>{template.emoji} {template.title}</p>
                    <p className={s.progressCount} style={{ color: progress === 1 ? 'var(--success)' : 'var(--warning)' }}>
                        {completedCount}/{totalCount}
                    </p>
                </div>
                <div className={s.progressBarBg}>
                    <div
                        className={s.progressBarFill}
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>
            </div>

            {/* Checklist items */}
            <div className={s.checklistContainer}>
                {template.items.map((item, i) => {
                    const key = `${activeType}-${i}`
                    const isChecked = checked[key]
                    const isTemp = activeType === 'food_temp'
                    return (
                        <div key={key} className={`${s.checkItem} ${isChecked ? s.checkItemDone : ''}`}>
                            <button
                                className={`${s.checkbox} ${isChecked ? s.checkboxChecked : ''}`}
                                onClick={() => toggle(key)}
                                type="button"
                            >
                                {isChecked && <span className={s.checkmark}>✓</span>}
                            </button>
                            <div className={s.checkContent}>
                                <p className={`${s.checkLabel} ${isChecked ? s.checkLabelDone : ''}`}>{item}</p>
                                {isTemp && (
                                    <input
                                        className={s.tempInput}
                                        value={tempValues[key] || ''}
                                        onChange={(e) => setTempValues((prev) => ({ ...prev, [key]: e.target.value }))}
                                        placeholder="Enter reading (e.g. 4°C)"
                                        inputMode="decimal"
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Notes */}
            <div className={s.notesSection}>
                <label className={s.label}>Additional Notes</label>
                <textarea
                    className={s.textarea}
                    value={notes[activeType] || ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [activeType]: e.target.value }))}
                    rows={3}
                    placeholder="Any issues or observations..."
                />
            </div>

            {submitted
                ? <div className={s.successBox}><p className={s.successText}>✅ Checklist submitted and recorded successfully!</p></div>
                : <button className={s.submitBtn} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : '✓ Submit Checklist'}
                </button>
            }

            <div style={{ height: 40 }} />
        </div>
    )
}
