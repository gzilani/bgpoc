import { Outlet, NavLink } from 'react-router-dom'
import { useStore } from '../store/useStore'
import s from './Layout.module.css'

const tabs = [
    { to: '/home', emoji: '🏠', label: 'Home' },
    { to: '/shifts', emoji: '📅', label: 'Shifts' },
    { to: '/payslips', emoji: '💰', label: 'Payslips' },
    { to: '/requests', emoji: '📋', label: 'Requests' },
    { to: '/safety', emoji: '⚠️', label: 'Safety' },
]

export default function Layout() {
    const unreadCount = useStore((s) => s.unreadCount)

    return (
        <div className={s.shell}>
            <main className={s.content}>
                <Outlet />
            </main>

            <nav className={s.nav}>
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        className={({ isActive }) => `${s.tab} ${isActive ? s.tabActive : ''}`}
                    >
                        <span className={s.tabIcon}>
                            {tab.emoji}
                            {tab.to === '/home' && unreadCount > 0 && (
                                <span className={s.badge}>{unreadCount}</span>
                            )}
                        </span>
                        <span className={s.tabLabel}>{tab.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}
