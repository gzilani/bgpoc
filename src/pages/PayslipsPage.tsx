import { useState } from 'react'
import s from './PayslipsPage.module.css'

const payslips = [
    { id: 1, period: 'Feb 1–15, 2026', gross: 2400, tax: 480, ni: 48, pension: 72, net: 1800, hours: 75, rate: 32, issued_at: 'Feb 16, 2026', breakdown: { income_tax: 480, national_insurance: 48, pension: 72 } },
    { id: 2, period: 'Jan 16–31, 2026', gross: 2560, tax: 512, ni: 51, pension: 77, net: 1920, hours: 80, rate: 32, issued_at: 'Feb 1, 2026', breakdown: { income_tax: 512, national_insurance: 51, pension: 77 } },
    { id: 3, period: 'Jan 1–15, 2026', gross: 2240, tax: 448, ni: 45, pension: 67, net: 1680, hours: 70, rate: 32, issued_at: 'Jan 16, 2026', breakdown: { income_tax: 448, national_insurance: 45, pension: 67 } },
]

export default function PayslipsPage() {
    const [selected, setSelected] = useState<typeof payslips[0] | null>(null)

    const totalNet = payslips.reduce((s, p) => s + p.net, 0)
    const totalHours = payslips.reduce((s, p) => s + p.hours, 0)
    const totalTax = payslips.reduce((s, p) => s + p.tax, 0)

    return (
        <div className={s.page}>
            <h1 className={s.pageTitle}>My Payslips</h1>

            {/* Summary */}
            <div className={s.summaryCard}>
                <p className={s.summaryLabel}>Total Earned (Last 3 periods)</p>
                <p className={s.summaryNet}>${totalNet.toLocaleString()}</p>
                <div className={s.summaryRow}>
                    <div className={s.summaryItem}>
                        <p className={s.summaryItemVal}>{totalHours}h</p>
                        <p className={s.summaryItemLabel}>Total Hours</p>
                    </div>
                    <div className={s.summaryDivider} />
                    <div className={s.summaryItem}>
                        <p className={s.summaryItemVal} style={{ color: 'var(--danger)' }}>${totalTax}</p>
                        <p className={s.summaryItemLabel}>Total Tax Paid</p>
                    </div>
                    <div className={s.summaryDivider} />
                    <div className={s.summaryItem}>
                        <p className={s.summaryItemVal} style={{ color: 'var(--info)' }}>$32/hr</p>
                        <p className={s.summaryItemLabel}>Hourly Rate</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className={s.list}>
                {payslips.map((p) => (
                    <button key={p.id} className={s.payslipCard} onClick={() => setSelected(p)}>
                        <div className={s.payslipLeft}>
                            <p className={s.payslipPeriod}>{p.period}</p>
                            <p className={s.payslipMeta}>{p.hours}h worked · Issued {p.issued_at}</p>
                        </div>
                        <div className={s.payslipRight}>
                            <p className={s.payslipNet}>${p.net.toLocaleString()}</p>
                            <p className={s.payslipNetLabel}>net pay</p>
                            <span className={s.issuedBadge}>✓ Issued</span>
                        </div>
                    </button>
                ))}
            </div>
            <div style={{ height: 24 }} />

            {/* Drawer */}
            {selected && (
                <div className={s.drawerOverlay} onClick={() => setSelected(null)}>
                    <div className={s.drawer} onClick={(e) => e.stopPropagation()}>
                        <div className={s.drawerHandle} />
                        <div className={s.drawerHeader}>
                            <div>
                                <p className={s.drawerTitle}>Payslip</p>
                                <p className={s.drawerPeriod}>{selected.period}</p>
                            </div>
                            <button className={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
                        </div>

                        <section className={s.section}>
                            <p className={s.sectionLabel}>Earnings</p>
                            <div className={s.row}><span>Hours Worked</span><span>{selected.hours}h</span></div>
                            <div className={s.row}><span>Hourly Rate</span><span>${selected.rate}/hr</span></div>
                            <div className={`${s.row} ${s.grossRow}`}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Gross Pay</span>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>${selected.gross.toLocaleString()}</span>
                            </div>
                        </section>

                        <section className={s.section}>
                            <p className={s.sectionLabel}>Deductions</p>
                            <div className={s.row}><span>Income Tax (20%)</span><span style={{ color: 'var(--danger)' }}>-${selected.breakdown.income_tax}</span></div>
                            <div className={s.row}><span>National Insurance (2%)</span><span style={{ color: 'var(--danger)' }}>-${selected.breakdown.national_insurance}</span></div>
                            <div className={s.row}><span>Pension (3%)</span><span style={{ color: 'var(--warning)' }}>-${selected.breakdown.pension}</span></div>
                        </section>

                        <div className={s.netSection}>
                            <p className={s.netLabel}>Net Pay</p>
                            <p className={s.netAmount}>${selected.net.toLocaleString()}</p>
                        </div>

                        <button className={s.downloadBtn}>⬇ Download PDF</button>
                    </div>
                </div>
            )}
        </div>
    )
}
