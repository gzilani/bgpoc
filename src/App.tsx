import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ShiftsPage from './pages/ShiftsPage'
import PayslipsPage from './pages/PayslipsPage'
import RequestsPage from './pages/RequestsPage'
import SafetyPage from './pages/SafetyPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
    const token = useStore((s) => s.token)
    if (!token) return <Navigate to="/login" replace />
    return <>{children}</>
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout />
                        </RequireAuth>
                    }
                >
                    <Route index element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="shifts" element={<ShiftsPage />} />
                    <Route path="payslips" element={<PayslipsPage />} />
                    <Route path="requests" element={<RequestsPage />} />
                    <Route path="safety" element={<SafetyPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
