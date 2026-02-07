import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const success = await login(username, password);
            if (success) {
                const user = JSON.parse(sessionStorage.getItem('css_user') || '{}');
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/member');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card shadow-sm">
                    <div className="card-body p-4 text-center">
                        {/* IAF Logo */}
                        <img
                            src="/assets/img/iaf-logo.png"
                            alt="Indian Air Force"
                            style={{ height: '120px', marginBottom: '16px' }}
                        />

                        {/* Application Name */}
                        <h2 className="mb-1" style={{ fontWeight: 'bold', color: '#1a365d' }}>PromoBoard</h2>
                        <p className="text-muted mb-4">Officer Promotion Selection System</p>

                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form onSubmit={handleSubmit} className="text-start">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                        <div className="text-muted small mt-3">
                            Admin: <code>admin</code> / <code>aman</code><br />
                            Members: <code>member1</code> / <code>deepak</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
