import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatistics, getBranches, Statistics } from '../../services/statisticsService';

const HomePage: React.FC = () => {
    const [statistics, setStatistics] = useState<Statistics>({});
    const [branches, setBranches] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [stats, branchList] = await Promise.all([
                getStatistics(),
                getBranches()
            ]);
            setStatistics(stats);
            setBranches(branchList);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalStats = () => {
        let total = 0;
        let reviewed = 0;
        Object.values(statistics).forEach(stat => {
            total += stat.total;
            reviewed += stat.reviewed;
        });
        return { total, reviewed };
    };

    const totalStats = getTotalStats();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-primary mb-2">PromoBoard</h1>
                <p className="text-muted">Military Promotion Board Management System</p>
            </div>

            {/* Overall Stats */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm bg-primary text-white">
                        <div className="card-body text-center py-4">
                            <h5 className="card-title mb-3">Overall Progress</h5>
                            <div className="display-4 fw-bold mb-2">
                                {totalStats.reviewed} / {totalStats.total}
                            </div>
                            <p className="mb-0">Candidates Reviewed</p>
                            <div className="progress mt-3" style={{ height: '8px' }}>
                                <div
                                    className="progress-bar bg-white"
                                    role="progressbar"
                                    style={{
                                        width: `${totalStats.total ? (totalStats.reviewed / totalStats.total * 100) : 0}%`,
                                        opacity: 0.8
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch-wise Stats */}
            <h5 className="text-center text-muted mb-3">Branch-wise Statistics</h5>
            <div className="row justify-content-center">
                {branches.map(branch => {
                    const stat = statistics[branch] || { total: 0, reviewed: 0 };
                    const progress = stat.total ? (stat.reviewed / stat.total * 100) : 0;

                    return (
                        <div key={branch} className="col-md-4 col-sm-6 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <h6 className="card-title text-uppercase text-primary fw-bold">
                                        {branch}
                                    </h6>
                                    <div className="d-flex align-items-baseline mb-2">
                                        <span className="display-6 fw-bold text-dark">
                                            {stat.reviewed}
                                        </span>
                                        <span className="text-muted ms-1">
                                            / {stat.total} reviewed
                                        </span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-5">
                <button
                    className="btn btn-primary btn-lg px-5 me-3"
                    onClick={() => navigate('/admin/preboard')}
                >
                    <i className="bi bi-play-fill me-2"></i>
                    Start Board
                </button>
                <button
                    className="btn btn-outline-secondary btn-lg px-5"
                    onClick={() => navigate('/admin/reports')}
                >
                    <i className="bi bi-file-text me-2"></i>
                    Reports
                </button>
            </div>

            {/* Quick Links */}
            <div className="row justify-content-center mt-5">
                <div className="col-md-8">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-4">
                                    <button
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => navigate('/admin/candidates')}
                                    >
                                        <div className="h4 mb-1">📋</div>
                                        <small className="text-muted">Manage Candidates</small>
                                    </button>
                                </div>
                                <div className="col-4">
                                    <button
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => navigate('/admin/members')}
                                    >
                                        <div className="h4 mb-1">👥</div>
                                        <small className="text-muted">Manage Members</small>
                                    </button>
                                </div>
                                <div className="col-4">
                                    <button
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => navigate('/admin/reports')}
                                    >
                                        <div className="h4 mb-1">📊</div>
                                        <small className="text-muted">View Reports</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
