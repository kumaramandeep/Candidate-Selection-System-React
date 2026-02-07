
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { MeetingProvider } from '../context/MeetingContext';
import Header from './shared/Header';
import ProtectedRoute from './shared/ProtectedRoute';
import LoginPage from './auth/LoginPage';
import AdminDashboard from './admin/AdminDashboard';
import MemberDashboard from './member/MemberDashboard';
import CandidatesPage from './admin/CandidatesPage';
import MembersPage from './admin/MembersPage';
import ReportsPage from './admin/ReportsPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/candidates"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <CandidatesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/members"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <MembersPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/reports"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <ReportsPage />
                    </ProtectedRoute>
                }
            />

            {/* Member routes */}
            <Route
                path="/member"
                element={
                    <ProtectedRoute requiredRole="member">
                        <MemberDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MeetingProvider>
                    <div className="min-vh-100 bg-light">
                        <Header />
                        <div className="container py-3">
                            <AppRoutes />
                        </div>
                    </div>
                </MeetingProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
