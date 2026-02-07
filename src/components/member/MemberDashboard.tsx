import React, { useState, FormEvent } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { voteService } from '../../services/voteService';
import { socketService } from '../../services/socketService';
import CandidateProfile from '../shared/CandidateProfile';

export default function MemberDashboard() {
    const { state, candidate, isLoading } = useMeeting();
    const { user } = useAuth();
    const [marks, setMarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const handleSubmitMarks = async (e: FormEvent) => {
        e.preventDefault();
        if (!state?.currentCandidateId || !user) return;

        const marksValue = parseInt(marks, 10);
        if (isNaN(marksValue) || marksValue < 0 || marksValue > 10) {
            setSubmitMessage({ type: 'danger', text: 'Marks must be between 0 and 10' });
            return;
        }

        if (!state.voteOpen) {
            setSubmitMessage({ type: 'warning', text: 'Voting is currently closed' });
            return;
        }

        setIsSubmitting(true);
        try {
            await voteService.upsertMarks(state.currentCandidateId, user.id, marksValue);

            // Emit socket event for real-time update to admin
            socketService.emitVoteSubmitted({
                candidateId: state.currentCandidateId,
                userId: user.id,
                marks: marksValue
            });

            setSubmitMessage({ type: 'success', text: 'Marks submitted successfully!' });
            setMarks('');
        } catch {
            setSubmitMessage({ type: 'danger', text: 'Failed to submit marks. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="mb-0">Member Dashboard</h2>
                    <div className="text-muted small">
                        Candidate profile is controlled by the Admin. Switching candidate happens automatically in real-time.
                    </div>
                </div>
                <span className="badge text-bg-info fs-6">
                    Current Candidate ID: {state?.currentCandidateId || 'None'}
                </span>
            </div>

            {/* Voting Status */}
            <div className="card mb-3">
                <div className="card-body d-flex flex-wrap align-items-center gap-3">
                    <span className={`badge ${state?.voteOpen ? 'bg-success' : 'bg-secondary'} fs-6`}>
                        {state?.voteOpen ? '🟢 VOTING OPEN' : '⚪ VOTING CLOSED'}
                    </span>
                    {state?.voteOpen && (
                        <span className="text-muted">You can now submit your marks for this candidate.</span>
                    )}
                </div>
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
                    No candidate is currently selected. Please wait for the admin to select a candidate.
                </div>
            )}

            {/* Voting Form */}
            {candidate && (
                <div className="card">
                    <div className="card-header">
                        <b>Give Marks (0 to 10)</b>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmitMarks}>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <input
                                    className="form-control"
                                    style={{ maxWidth: '150px' }}
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={marks}
                                    onChange={(e) => setMarks(e.target.value)}
                                    placeholder="0-10"
                                    required
                                    disabled={!state?.voteOpen || isSubmitting}
                                />
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={!state?.voteOpen || isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                                {submitMessage.text && (
                                    <span className={`small text-${submitMessage.type}`}>
                                        {submitMessage.text}
                                    </span>
                                )}
                            </div>
                        </form>
                        <div className="small text-muted mt-2">
                            Your marks are saved instantly and are visible to the admin in real-time.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
