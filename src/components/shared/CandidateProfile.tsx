
import CandidateTabs from './CandidateTabs';
import type { CandidateFull } from '../../types';

interface CandidateProfileProps {
    candidateData: CandidateFull;
    showPhoto?: boolean;
}

export default function CandidateProfile({ candidateData, showPhoto = true }: CandidateProfileProps) {
    const c = candidateData.candidate;
    const photoUrl = c.photoPath.startsWith('http')
        ? c.photoPath
        : `/assets/img/placeholder.jpg`;

    return (
        <div>
            <div className="d-flex align-items-center gap-3 mb-3">
                {showPhoto && (
                    <img
                        className="rounded border"
                        src={photoUrl}
                        alt="Candidate Photo"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/img/placeholder.jpg';
                        }}
                    />
                )}
                <div>
                    <h3 className="mb-1">{c.fullName}</h3>
                    <div className="text-muted">
                        <span className="me-3"><strong>Expertise:</strong> {c.expertise}</span>
                        <span className="me-3"><strong>Latest Qualif.:</strong> {c.latestQualification}</span>
                        <span className="me-3"><strong>Last Company:</strong> {c.lastCompany}</span>
                        <span><strong>Experience:</strong> {c.totalExperienceYears} years</span>
                    </div>
                </div>
            </div>

            <CandidateTabs candidate={candidateData} />
        </div>
    );
}
