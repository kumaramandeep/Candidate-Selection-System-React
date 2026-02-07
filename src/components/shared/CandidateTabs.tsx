import React from 'react';
import type { CandidateFull } from '../../types';

interface CandidateTabsProps {
    candidate: CandidateFull;
}

export default function CandidateTabs({ candidate }: CandidateTabsProps) {
    const { personal, qualifications, experiences, certifications } = candidate;
    const c = candidate.candidate;

    return (
        <>
            <ul className="nav nav-tabs mt-3" id="candidateTabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-main" type="button" role="tab">
                        Main
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-personal" type="button" role="tab">
                        Personal
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-qualifications" type="button" role="tab">
                        Qualifications
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-experience" type="button" role="tab">
                        Past Experience
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-certifications" type="button" role="tab">
                        Specialisation / Certifications
                    </button>
                </li>
            </ul>

            <div className="tab-content border border-top-0 p-3 bg-white" id="candidateTabContent">
                {/* Main Tab */}
                <div className="tab-pane fade show active" id="tab-main" role="tabpanel">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Summary</h6>
                                    <ul className="mb-0">
                                        <li><strong>Name:</strong> {c.fullName}</li>
                                        <li><strong>Field of Expertise:</strong> {c.expertise}</li>
                                        <li><strong>Most Recent Qualification:</strong> {c.latestQualification}</li>
                                        <li><strong>Last Company:</strong> {c.lastCompany}</li>
                                        <li><strong>Total Experience:</strong> {c.totalExperienceYears} years</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Quick Info</h6>
                                    {personal ? (
                                        <ul className="mb-0">
                                            <li><strong>Phone:</strong> {personal.phone || 'N/A'}</li>
                                            <li><strong>Nationality:</strong> {personal.nationality || 'N/A'}</li>
                                            <li><strong>Address:</strong> {personal.address || 'N/A'}</li>
                                        </ul>
                                    ) : (
                                        <p className="text-muted mb-0">No personal data available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Tab */}
                <div className="tab-pane fade" id="tab-personal" role="tabpanel">
                    {personal ? (
                        <div className="row g-3">
                            <div className="col-md-6"><strong>Address:</strong><br />{personal.address || '-'}</div>
                            <div className="col-md-6"><strong>Nationality:</strong><br />{personal.nationality || '-'}</div>
                            <div className="col-md-6"><strong>Phone:</strong><br />{personal.phone || '-'}</div>
                            <div className="col-md-6"><strong>Father:</strong><br />{personal.father || '-'}</div>
                            <div className="col-md-6"><strong>Mother:</strong><br />{personal.mother || '-'}</div>
                            <div className="col-md-6"><strong>Spouse:</strong><br />{personal.spouse || '-'}</div>
                            <div className="col-12"><strong>Children:</strong><br />{personal.children || '-'}</div>
                        </div>
                    ) : (
                        <p className="text-muted">No personal information available.</p>
                    )}
                </div>

                {/* Qualifications Tab */}
                <div className="tab-pane fade" id="tab-qualifications" role="tabpanel">
                    {qualifications.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>Level</th><th>Subject</th><th>Institution</th><th>Year</th><th>Marks</th><th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {qualifications.map((q, i) => (
                                        <tr key={i}>
                                            <td>{q.level}</td>
                                            <td>{q.subject}</td>
                                            <td>{q.institution}</td>
                                            <td>{q.year || '-'}</td>
                                            <td>{q.marks}</td>
                                            <td>{q.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">No qualification records.</p>
                    )}
                </div>

                {/* Experience Tab */}
                <div className="tab-pane fade" id="tab-experience" role="tabpanel">
                    {experiences.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>From</th><th>To</th><th>Company</th><th>Address</th><th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiences.map((e, i) => (
                                        <tr key={i}>
                                            <td>{e.fromYear || '-'}</td>
                                            <td>{e.toYear || '-'}</td>
                                            <td>{e.company}</td>
                                            <td>{e.address}</td>
                                            <td>{e.roleTitle}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">No experience records.</p>
                    )}
                </div>

                {/* Certifications Tab */}
                <div className="tab-pane fade" id="tab-certifications" role="tabpanel">
                    {certifications.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>Title</th><th>Authority</th><th>Year</th><th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certifications.map((cert, i) => (
                                        <tr key={i}>
                                            <td>{cert.title}</td>
                                            <td>{cert.authority}</td>
                                            <td>{cert.year || '-'}</td>
                                            <td>{cert.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">No certifications.</p>
                    )}
                </div>
            </div>
        </>
    );
}
