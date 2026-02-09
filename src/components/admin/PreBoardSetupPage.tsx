import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBranches, getCandidatesByBranch } from '../../services/statisticsService';

interface Candidate {
    id: number;
    employeeId: string;
    fullName: string;
    rank: string;
    timer: number;
    branch: string;
}

const PreBoardSetupPage: React.FC = () => {
    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedTimers, setSelectedTimers] = useState<number[]>([1, 2, 3, 4, 5]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [runThrough, setRunThrough] = useState<string>('AR_SENIORITY');
    const navigate = useNavigate();

    useEffect(() => {
        loadBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            loadCandidates();
        }
    }, [selectedBranch, selectedTimers]);

    const loadBranches = async () => {
        try {
            const branchList = await getBranches();
            setBranches(branchList);
            if (branchList.length > 0) {
                setSelectedBranch(branchList[0]);
            }
        } catch (error) {
            console.error('Error loading branches:', error);
        }
    };

    const loadCandidates = async () => {
        setLoading(true);
        try {
            const data = await getCandidatesByBranch(selectedBranch, selectedTimers);
            setCandidates(data);
        } catch (error) {
            console.error('Error loading candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTimer = (timer: number) => {
        if (selectedTimers.includes(timer)) {
            setSelectedTimers(selectedTimers.filter(t => t !== timer));
        } else {
            setSelectedTimers([...selectedTimers, timer].sort());
        }
    };

    const handleStart = () => {
        if (candidates.length > 0) {
            // Store session info in sessionStorage
            sessionStorage.setItem('boardSession', JSON.stringify({
                branch: selectedBranch,
                timers: selectedTimers,
                runThrough: runThrough,
                candidateIds: candidates.map(c => c.id)
            }));
            // Navigate to first candidate
            navigate(`/admin/dashboard?candidateId=${candidates[0].id}`);
        }
    };

    return (
        <div className="preboard-setup">
            {/* Header with Branch Selection */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Pre-Board Setup</h4>
                <div className="d-flex align-items-center gap-3">
                    <label className="form-label mb-0 fw-bold">Branch:</label>
                    <select
                        className="form-select"
                        style={{ width: '150px' }}
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        {branches.map(branch => (
                            <option key={branch} value={branch}>{branch}</option>
                        ))}
                    </select>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/admin')}
                    >
                        ← Home
                    </button>
                </div>
            </div>

            <div className="row">
                {/* Left Panel - Filters */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0">Filters</h6>
                        </div>
                        <div className="card-body">
                            {/* Timer Buckets */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Timer Buckets</label>
                                {[1, 2, 3, 4, 5].map(timer => (
                                    <div key={timer} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`timer-${timer}`}
                                            checked={selectedTimers.includes(timer)}
                                            onChange={() => toggleTimer(timer)}
                                        />
                                        <label className="form-check-label" htmlFor={`timer-${timer}`}>
                                            {timer === 1 ? '1st' : timer === 2 ? '2nd' : timer === 3 ? '3rd' : `${timer}th`} Timer
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Run Through */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Run Through</label>
                                <select
                                    className="form-select"
                                    value={runThrough}
                                    onChange={(e) => setRunThrough(e.target.value)}
                                >
                                    <option value="AR_SENIORITY">AR Seniority</option>
                                    <option value="PB_SENIORITY" disabled>PB Seniority (Coming Soon)</option>
                                    <option value="PREBOARD_MERIT" disabled>Preboard Merit (Coming Soon)</option>
                                    <option value="FINAL_MERIT" disabled>Final Merit (Coming Soon)</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-success btn-lg"
                                    onClick={handleStart}
                                    disabled={candidates.length === 0}
                                >
                                    Start Session
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/admin')}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Candidate List */}
                <div className="col-md-9">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                                Candidates
                                <span className="badge bg-primary ms-2">{candidates.length}</span>
                            </h6>
                            <small className="text-muted">
                                Sorted by Employee ID (Ascending)
                            </small>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : candidates.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <p className="mb-0">No candidates found for selected filters</p>
                                </div>
                            ) : (
                                <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light sticky-top">
                                            <tr>
                                                <th style={{ width: '60px' }}>#</th>
                                                <th style={{ width: '120px' }}>Employee ID</th>
                                                <th>Rank & Name</th>
                                                <th style={{ width: '100px' }}>Timer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map((candidate, index) => (
                                                <tr key={candidate.id}>
                                                    <td className="text-muted">{index + 1}</td>
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {candidate.employeeId}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong>{candidate.rank}</strong> {candidate.fullName}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${candidate.timer === 1 ? 'bg-success' : candidate.timer === 2 ? 'bg-info' : 'bg-warning'}`}>
                                                            {candidate.timer === 1 ? '1st' : candidate.timer === 2 ? '2nd' : candidate.timer === 3 ? '3rd' : `${candidate.timer}th`}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreBoardSetupPage;
