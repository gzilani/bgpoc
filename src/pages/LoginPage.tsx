import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import s from './LoginPage.module.css'

export default function LoginPage() {
    const [email, setEmail] = useState('alice@restaurant.com')
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const setEmployee = useStore((store) => store.setEmployee)
    const setTokenStore = useStore((store) => store.setToken)
    const navigate = useNavigate()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        // TODO: Replace with real Supabase auth.signInWithPassword
        setTimeout(() => {
            setTokenStore('demo-token-123')
            setEmployee({
                id: 'emp-001',
                name: 'Alice Johnson',
                role: 'Head Chef',
                email,
                hourly_rate: 32,
                avatar_initials: 'AJ',
            })
            setLoading(false)
            navigate('/home')
        }, 1000)
    }

    return (
        <div className={s.page}>
            <div className={s.container}>
                {/* Logo */}
                <div className={s.logoContainer}>
                    <div className={s.logoBox}>🍽️</div>
                    <h1 className={s.appName}>RestaurantOS</h1>
                    <p className={s.appSub}>Employee Portal</p>
                </div>

                <h2 className={s.heading}>Welcome back!</h2>
                <p className={s.sub}>Sign in to access your shifts and attendance</p>

                <form className={s.form} onSubmit={handleLogin}>
                    <div className={s.inputGroup}>
                        <label className={s.label}>Email Address</label>
                        <input
                            className={s.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className={s.inputGroup}>
                        <label className={s.label}>Digital Access Token</label>
                        <input
                            className={s.input}
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter your secure token"
                            autoComplete="current-password"
                        />
                        <p className={s.hint}>
                            🔐 Your unique digital token is sent by admin when your account is created.
                        </p>
                    </div>

                    <button className={s.loginBtn} type="submit" disabled={loading}>
                        {loading ? <span className={s.spinner} /> : 'Sign In →'}
                    </button>
                </form>

                <p className={s.demo}>Demo: alice@restaurant.com (any token)</p>
            </div>
        </div>
    )
}
