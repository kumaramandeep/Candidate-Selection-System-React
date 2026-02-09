import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMeeting } from '../../context/MeetingContext';
import { voteService } from '../../services/voteService';
import { socketService } from '../../services/socketService';
import { markAsReviewed } from '../../services/statisticsService';
import CandidateTabs from '../shared/CandidateTabs';
import type { VoteStatus, CandidateFull } from '../../types';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { state, candidate, goToNextCandidate, goToPrevCandidate, openVote, closeVote, isLoading, setCurrentCandidate } = useMeeting();
    const [voteStatus, setVoteStatus] = useState<VoteStatus[]>([]);
    const [counts, setCounts] = useState({ totalMembers: 0, submittedMembers: 0 });
    const [isNavigating, setIsNavigating] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Load session info on mount
    useEffect(() => {
        const savedSession = sessionStorage.getItem('boardSession');
        if (savedSession) {
            setSessionInfo(JSON.parse(savedSession));
        }
    }, []);

    // Set candidate from URL param
    useEffect(() => {
        const candidateId = searchParams.get('candidateId');
        if (candidateId && setCurrentCandidate) {
            setCurrentCandidate(Number(candidateId));
        }
    }, [searchParams, setCurrentCandidate]);

    // Update current index based on session
    useEffect(() => {
        if (sessionInfo && state?.currentCandidateId) {
            const idx = sessionInfo.candidateIds?.indexOf(state.currentCandidateId);
            if (idx >= 0) setCurrentIndex(idx);
        }
    }, [sessionInfo, state?.currentCandidateId]);

    const loadVoteStatus = useCallback(async () => {
        if (!state?.currentCandidateId) return;
        const status = await voteService.statusForCandidate(state.currentCandidateId);
        setVoteStatus(status);
        const c = await voteService.countSubmitted(state.currentCandidateId);
        setCounts(c);
    }, [state?.currentCandidateId]);

    useEffect(() => {
        loadVoteStatus();
    }, [loadVoteStatus]);

    useEffect(() => {
        const unsubscribe = socketService.onVoteSubmitted(() => {
            loadVoteStatus();
        });
        return unsubscribe;
    }, [loadVoteStatus]);

    const handleNext = async () => {
        if (sessionInfo && sessionInfo.candidateIds) {
            const nextIdx = currentIndex + 1;
            if (nextIdx < sessionInfo.candidateIds.length) {
                const nextId = sessionInfo.candidateIds[nextIdx];
                setCurrentCandidate?.(nextId);
                setCurrentIndex(nextIdx);
                // Mark current as reviewed
                if (state?.currentCandidateId) {
                    markAsReviewed(state.currentCandidateId);
                }
            }
        } else {
            setIsNavigating(true);
            await goToNextCandidate();
            setIsNavigating(false);
        }
    };

    const handlePrev = async () => {
        if (sessionInfo && sessionInfo.candidateIds) {
            const prevIdx = currentIndex - 1;
            if (prevIdx >= 0) {
                const prevId = sessionInfo.candidateIds[prevIdx];
                setCurrentCandidate?.(prevId);
                setCurrentIndex(prevIdx);
            }
        } else {
            setIsNavigating(true);
            await goToPrevCandidate();
            setIsNavigating(false);
        }
    };

    const handleOpenVote = async () => await openVote();
    const handleCloseVote = async () => await closeVote();

    const handleResetMarks = async () => {
        if (!state?.currentCandidateId) return;
        if (!window.confirm('Are you sure you want to reset all marks for this candidate?')) return;
        await voteService.deleteByCandidate(state.currentCandidateId);
        loadVoteStatus();
    };

    const getPhotoUrl = (path?: string) => {
        if (path && path.startsWith('http')) return path;
        return '/assets/img/placeholder.svg';
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const c = candidate;
    const totalCandidates = sessionInfo?.candidateIds?.length || 1;

    return (
        <div className="admin-dashboard">
            {/* Top Navigation Bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    {sessionInfo && (
                        <span className="badge bg-primary fs-6">
                            {sessionInfo.branch}
                        </span>
                    )}
                    <span className="text-muted">|</span>
                    <span className="text-muted small">
                        {currentIndex + 1} of {totalCandidates}
                    </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin')}>
                        Home
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/preboard')}>
                        Back to Setup
                    </button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="card mb-3 border-0 shadow-sm">
                <div className="card-body d-flex flex-wrap align-items-center gap-2 py-2">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handlePrev}
                        disabled={isNavigating || currentIndex === 0}
                    >
                        ◀ Previous
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleNext}
                        disabled={isNavigating || currentIndex >= totalCandidates - 1}
                    >
                        Next ▶
                    </button>

                    <div className="vr mx-2" />

                    <button
                        className={`btn btn-sm ${state?.voteOpen ? 'btn-warning' : 'btn-success'}`}
                        onClick={state?.voteOpen ? handleCloseVote : handleOpenVote}
                    >
                        {state?.voteOpen ? '⏸ Close Voting' : '▶ Prompt for Voting'}
                    </button>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleResetMarks}
                    >
                        Reset Marks
                    </button>

                    <div className="ms-auto">
                        <span className={`badge ${state?.voteOpen ? 'bg-success' : 'bg-secondary'} fs-6`}>
                            {state?.voteOpen ? '🟢 VOTING OPEN' : '⚪ VOTING CLOSED'}
                        </span>
                    </div>
                </div>
            </div>

            {c ? (
                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {/* Candidate Profile Card */}
                        <div className="card mb-3 border-0 shadow-sm">
                            <div className="card-body">
                                {/* Photos + Info Row */}
                                <div className="d-flex gap-4 mb-4">
                                    {/* Dual Photos */}
                                    <div className="d-flex gap-2">
                                        <img
                                            src={getPhotoUrl(c.photoPath)}
                                            alt="Portrait"
                                            className="rounded border"
                                            style={{ width: '100px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => window.open(getPhotoUrl(c.photoPath), '_blank')}
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/img/placeholder.svg'; }}
                                        />
                                        <img
                                            src={getPhotoUrl(c.photo2Path)}
                                            alt="Full Body"
                                            className="rounded border"
                                            style={{ width: '100px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => window.open(getPhotoUrl(c.photo2Path), '_blank')}
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/img/placeholder.svg'; }}
                                        />
                                    </div>

                                    {/* Officer Details */}
                                    <div className="flex-grow-1">
                                        <h4 className="mb-1 text-primary">
                                            {c.rank} {c.fullName}
                                        </h4>
                                        <div className="text-muted mb-2">
                                            <span className="badge bg-secondary me-2">{c.employeeId}</span>
                                            <span className="badge bg-info">{c.branch}</span>
                                        </div>

                                        <div className="row small">
                                            <div className="col-6">
                                                <div><strong>Unit:</strong> {c.unit || '-'}</div>
                                                <div><strong>Appt:</strong> {c.appt || '-'}</div>
                                                <div><strong>Category:</strong> {c.category || '-'}</div>
                                            </div>
                                            <div className="col-6">
                                                <div><strong>DoP:</strong> {c.dop || '-'}</div>
                                                <div><strong>DoR:</strong> {c.dor || '-'}</div>
                                                <div><strong>Timer:</strong> {c.timer ? `${c.timer}${c.timer === 1 ? 'st' : c.timer === 2 ? 'nd' : c.timer === 3 ? 'rd' : 'th'}` : '-'}</div>
                                            </div>
                                        </div>

                                        {c.decorations && (
                                            <div className="mt-2 small">
                                                <strong>Decorations:</strong> {c.decorations}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tabs */}
                                <CandidateTabs candidate={c} />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-lg-4">
                        {/* Live Voting Status */}
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
                                <span className="fw-bold">Live Voting Status</span>
                                <button className="btn btn-sm btn-light" onClick={loadVoteStatus}>
                                    ↻
                                </button>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-sm mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Member</th>
                                            <th className="text-center">Marks</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voteStatus.filter(v => v.role === 'member').map((row) => (
                                            <tr key={row.userId}>
                                                <td className="small">{row.fullName}</td>
                                                <td className="text-center">
                                                    {row.marks !== null ? (
                                                        <span className="badge bg-primary">{row.marks}</span>
                                                    ) : (
                                                        <span className="text-muted small">Pending</span>
                                                    )}
                                                </td>
                                                <td className="small text-muted">
                                                    {row.submittedAt ? new Date(row.submittedAt).toLocaleTimeString() : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {voteStatus.filter(v => v.role === 'member').length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted small py-3">
                                                    No members found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer bg-light py-2">
                                <small className="text-muted">
                                    Submitted: <strong>{counts.submittedMembers}</strong> / {counts.totalMembers}
                                </small>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light py-2">
                                <span className="fw-bold small">Quick Actions</span>
                            </div>
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/admin/reports')}>
                                        📊 View Reports
                                    </button>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/candidates')}>
                                        📋 Manage Candidates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">
                    No candidate is currently selected.
                    <button className="btn btn-link" onClick={() => navigate('/admin/preboard')}>
                        Go to Pre-Board Setup
                    </button>
                </div>
            )}
        </div>
    );
}
