import React, { useState, useEffect, useCallback } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { voteService } from '../../services/voteService';
import { socketService } from '../../services/socketService';
import CandidateProfile from '../shared/CandidateProfile';
import type { VoteStatus } from '../../types';

export default function AdminDashboard() {
    const { state, candidate, goToNextCandidate, goToPrevCandidate, openVote, closeVote, isLoading } = useMeeting();
    const [voteStatus, setVoteStatus] = useState<VoteStatus[]>([]);
    const [counts, setCounts] = useState({ totalMembers: 0, submittedMembers: 0 });
    const [isNavigating, setIsNavigating] = useState(false);

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

    // Listen for vote submissions
    useEffect(() => {
        const unsubscribe = socketService.onVoteSubmitted(() => {
            loadVoteStatus();
        });
        return unsubscribe;
    }, [loadVoteStatus]);

    const handleNext = async () => {
        setIsNavigating(true);
        await goToNextCandidate();
        setIsNavigating(false);
    };

    const handlePrev = async () => {
        setIsNavigating(true);
        await goToPrevCandidate();
        setIsNavigating(false);
    };

    const handleOpenVote = async () => {
        await openVote();
    };

    const handleCloseVote = async () => {
        await closeVote();
    };

    const handleResetMarks = async () => {
        if (!state?.currentCandidateId) return;
        if (!window.confirm('Are you sure you want to reset all marks for this candidate?')) return;
        await voteService.deleteByCandidate(state.currentCandidateId);
        loadVoteStatus();
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

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="mb-0">Admin / HR Manager Dashboard</h2>
                    <div className="text-muted small">
                        Controls the meeting. Changing candidate here syncs to all members in real-time.
                    </div>
                </div>
            </div>

            {/* Top controls */}
            <div className="card mb-3">
                <div className="card-body d-flex flex-wrap align-items-center gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrev}
                        disabled={isNavigating}
                    >
                        Previous Candidate
                    </button>

                    <div className="ms-3">
                        <strong>Current Candidate ID:</strong> {state?.currentCandidateId || 'None'}
                    </div>

                    <div className="ms-auto d-flex align-items-center gap-2">
                        <button
                            className="btn btn-dark"
                            onClick={handleOpenVote}
                            disabled={state?.voteOpen}
                        >
                            Prompt for Marks Award
                        </button>
                        <button
                            className="btn btn-outline-dark"
                            onClick={handleCloseVote}
                            disabled={!state?.voteOpen}
                        >
                            Close Voting
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleNext}
                            disabled={isNavigating}
                        >
                            Next Candidate
                        </button>
                    </div>
                </div>
            </div>

            {/* Voting Status Badge */}
            <div className="mb-3">
                <span className={`badge ${state?.voteOpen ? 'bg-success' : 'bg-secondary'} fs-6`}>
                    {state?.voteOpen ? '🟢 VOTING OPEN' : '⚪ VOTING CLOSED'}
                </span>
            </div>

            {/* Candidate Profile */}
            {candidate ? (
                <div className="card mb-3">
                    <div className="card-body">
                        <CandidateProfile candidateData={candidate} />
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">
                    No candidate is currently selected. Please add candidates or navigate to one.
                </div>
            )}

            {/* Board Marks */}
            <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div><b>Board Marks</b></div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={loadVoteStatus}>
                            Refresh
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleResetMarks}>
                            Reset All Marks
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm align-middle">
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Marks</th>
                                    <th>Submitted at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voteStatus.filter(v => v.role === 'member').map((row) => (
                                    <tr key={row.userId}>
                                        <td>{row.fullName} (@{row.username})</td>
                                        <td>
                                            {row.marks !== null ? (
                                                <span className="badge bg-primary">{row.marks}</span>
                                            ) : (
                                                <span className="text-muted">Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            {row.submittedAt ? (
                                                new Date(row.submittedAt).toLocaleString()
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {voteStatus.filter(v => v.role === 'member').length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-muted">No members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="small text-muted">
                        Members submitted: <span className="fw-bold">{counts.submittedMembers}</span> / {counts.totalMembers}
                    </div>
                </div>
            </div>
        </div>
    );
}
