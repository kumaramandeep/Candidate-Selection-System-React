import React from 'react';
import type { CandidateFull } from '../../types';

interface CandidateTabsProps {
    candidate: CandidateFull;
}

export default function CandidateTabs({ candidate }: CandidateTabsProps) {
    const { personal, qualifications = [], experiences = [], certifications = [] } = candidate;
    const c = candidate;

    return (
        <>
            <ul className="nav nav-tabs" id="candidateTabs" role="tablist">
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
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-courses" type="button" role="tab">
                        Mand Courses
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-postings" type="button" role="tab">
                        Past Postings
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-qualifications" type="button" role="tab">
                        Qualifications
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-remarks" type="button" role="tab">
                        +ve / -ve
                    </button>
                </li>
            </ul>

            <div className="tab-content border border-top-0 p-3 bg-white" id="candidateTabContent">
                {/* Main Tab */}
                <div className="tab-pane fade show active" id="tab-main" role="tabpanel">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card border-0 bg-light">
                                <div className="card-body">
                                    <h6 className="card-title text-primary">Service Details</h6>
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            <tr><td className="fw-bold">Employee ID</td><td>{c.employeeId || '-'}</td></tr>
                                            <tr><td className="fw-bold">Rank</td><td>{c.rank || '-'}</td></tr>
                                            <tr><td className="fw-bold">Branch</td><td>{c.branch || '-'}</td></tr>
                                            <tr><td className="fw-bold">Timer</td><td>{c.timer ? `${c.timer}${c.timer === 1 ? 'st' : c.timer === 2 ? 'nd' : c.timer === 3 ? 'rd' : 'th'}` : '-'}</td></tr>
                                            <tr><td className="fw-bold">Category</td><td>{c.category || '-'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 bg-light">
                                <div className="card-body">
                                    <h6 className="card-title text-primary">Appointment Details</h6>
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            <tr><td className="fw-bold">Unit</td><td>{c.unit || '-'}</td></tr>
                                            <tr><td className="fw-bold">Appointment</td><td>{c.appt || '-'}</td></tr>
                                            <tr><td className="fw-bold">DoP</td><td>{c.dop || '-'}</td></tr>
                                            <tr><td className="fw-bold">DoR</td><td>{c.dor || '-'}</td></tr>
                                            <tr><td className="fw-bold">Relying Hrs</td><td>{c.relyingHrs || '-'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {c.decorations && (
                            <div className="col-12">
                                <div className="card border-0 bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title text-primary">Decorations</h6>
                                        <p className="mb-0">{c.decorations}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal Tab */}
                <div className="tab-pane fade" id="tab-personal" role="tabpanel">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card border-0 bg-light">
                                <div className="card-body">
                                    <h6 className="card-title text-primary">Contact Information</h6>
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            <tr><td className="fw-bold">Phone</td><td>{c.phone || '-'}</td></tr>
                                            <tr><td className="fw-bold">Email</td><td>{c.email || '-'}</td></tr>
                                            <tr><td className="fw-bold">DOB</td><td>{c.dob || '-'}</td></tr>
                                            <tr><td className="fw-bold">Gender</td><td>{c.gender || '-'}</td></tr>
                                            <tr><td className="fw-bold">Marital Status</td><td>{c.maritalStatus || '-'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 bg-light">
                                <div className="card-body">
                                    <h6 className="card-title text-primary">Address</h6>
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            <tr><td className="fw-bold">Current</td><td>{c.currentAddress || '-'}</td></tr>
                                            <tr><td className="fw-bold">Permanent</td><td>{c.permanentAddress || '-'}</td></tr>
                                            <tr><td className="fw-bold">Nationality</td><td>{c.nationality || '-'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mandatory Courses Tab */}
                <div className="tab-pane fade" id="tab-courses" role="tabpanel">
                    <p className="text-muted mb-2">Mandatory service courses completed by the officer.</p>
                    {certifications.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>Course Title</th><th>Authority</th><th>Year</th><th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certifications.map((cert, i) => (
                                        <tr key={i}>
                                            <td>{cert.title}</td>
                                            <td>{cert.authority || '-'}</td>
                                            <td>{cert.year || '-'}</td>
                                            <td>{cert.notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-light mb-0">No mandatory courses on record.</div>
                    )}
                </div>

                {/* Past Postings Tab */}
                <div className="tab-pane fade" id="tab-postings" role="tabpanel">
                    <p className="text-muted mb-2">Previous unit postings and assignments.</p>
                    {experiences.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>From</th><th>To</th><th>Unit</th><th>Location</th><th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiences.map((e, i) => (
                                        <tr key={i}>
                                            <td>{e.fromYear || '-'}</td>
                                            <td>{e.toYear || '-'}</td>
                                            <td>{e.company}</td>
                                            <td>{e.address || '-'}</td>
                                            <td>{e.roleTitle || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-light mb-0">No past postings on record.</div>
                    )}
                </div>

                {/* Qualifications Tab */}
                <div className="tab-pane fade" id="tab-qualifications" role="tabpanel">
                    <p className="text-muted mb-2">Educational qualifications and degrees.</p>
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
                                            <td>{q.subject || '-'}</td>
                                            <td>{q.institution || '-'}</td>
                                            <td>{q.year || '-'}</td>
                                            <td>{q.marks || '-'}</td>
                                            <td>{q.grade || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-light mb-0">No qualification records.</div>
                    )}
                </div>

                {/* +ve / -ve Remarks Tab */}
                <div className="tab-pane fade" id="tab-remarks" role="tabpanel">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card border-success">
                                <div className="card-header bg-success text-white">
                                    <strong>+ve Remarks</strong>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted mb-0">No positive remarks recorded yet.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-danger">
                                <div className="card-header bg-danger text-white">
                                    <strong>-ve Remarks</strong>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted mb-0">No negative remarks recorded.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
