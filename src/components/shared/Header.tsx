import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const isAdmin = user.role === 'admin';
    const basePath = isAdmin ? '/admin' : '/member';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to={basePath}>
                    Candidate Selection System
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === basePath ? 'active' : ''}`}
                                to={basePath}
                            >
                                Dashboard
                            </Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/admin/members' ? 'active' : ''}`}
                                        to="/admin/members"
                                    >
                                        Members
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/admin/candidates' ? 'active' : ''}`}
                                        to="/admin/candidates"
                                    >
                                        Candidates
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/admin/reports' ? 'active' : ''}`}
                                        to="/admin/reports"
                                    >
                                        Reports
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <span className="nav-link text-light">
                                <i className="bi bi-person-circle me-1"></i>
                                {user.fullName} ({user.role})
                            </span>
                        </li>
                        <li className="nav-item">
                            <button
                                className="btn btn-outline-light btn-sm ms-2"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
