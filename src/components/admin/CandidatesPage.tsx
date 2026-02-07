import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';
import { useMeeting } from '../../context/MeetingContext';
import type { Candidate } from '../../types';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { setCurrentCandidate } = useMeeting();

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        expertise: '',
        totalExperienceYears: 0,
        latestQualification: '',
        lastCompany: '',
        address: '',
        nationality: '',
        phone: '',
        father: '',
        mother: '',
        spouse: '',
        children: ''
    });

    // Dynamic arrays
    const [qualifications, setQualifications] = useState<Array<{
        level: string; subject: string; institution: string; year: number; marks: string; grade: string;
    }>>([]);
    const [experiences, setExperiences] = useState<Array<{
        fromYear: number; toYear: number; company: string; address: string; roleTitle: string;
    }>>([]);
    const [certifications, setCertifications] = useState<Array<{
        title: string; authority: string; year: number; notes: string;
    }>>([]);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        setIsLoading(true);
        const list = await candidateService.listBasic();
        setCandidates(list);
        setIsLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.expertise) {
            setMessage({ type: 'danger', text: 'Full Name and Expertise are required.' });
            return;
        }

        setIsSubmitting(true);
        try {
            await candidateService.create({
                fullName: formData.fullName,
                expertise: formData.expertise,
                totalExperienceYears: formData.totalExperienceYears,
                latestQualification: formData.latestQualification,
                lastCompany: formData.lastCompany,
                personal: {
                    address: formData.address,
                    nationality: formData.nationality,
                    phone: formData.phone,
                    father: formData.father,
                    mother: formData.mother,
                    spouse: formData.spouse,
                    children: formData.children
                },
                qualifications: qualifications.filter(q => q.level),
                experiences: experiences.filter(e => e.company),
                certifications: certifications.filter(c => c.title)
            });

            setMessage({ type: 'success', text: 'Candidate created successfully!' });
            // Reset form
            setFormData({
                fullName: '', expertise: '', totalExperienceYears: 0, latestQualification: '',
                lastCompany: '', address: '', nationality: '', phone: '', father: '', mother: '',
                spouse: '', children: ''
            });
            setQualifications([]);
            setExperiences([]);
            setCertifications([]);
            loadCandidates();
        } catch {
            setMessage({ type: 'danger', text: 'Failed to create candidate.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenCandidate = async (id: number) => {
        await setCurrentCandidate(id);
    };

    const addQualification = () => {
        setQualifications([...qualifications, { level: '', subject: '', institution: '', year: 0, marks: '', grade: '' }]);
    };

    const addExperience = () => {
        setExperiences([...experiences, { fromYear: 0, toYear: 0, company: '', address: '', roleTitle: '' }]);
    };

    const addCertification = () => {
        setCertifications([...certifications, { title: '', authority: '', year: 0, notes: '' }]);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Candidates</h2>
                <Link className="btn btn-outline-secondary" to="/admin">Back to Dashboard</Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible`}>
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
            )}

            <div className="row g-3">
                {/* Add Candidate Form */}
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Add Candidate</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label">Full Name *</label>
                                    <input className="form-control" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                                </div>

                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Expertise *</label>
                                        <input className="form-control" name="expertise" value={formData.expertise} onChange={handleInputChange} placeholder="coding, HR, sales..." required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Total Experience (years)</label>
                                        <input type="number" min="0" className="form-control" name="totalExperienceYears" value={formData.totalExperienceYears} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="row g-2 mt-1">
                                    <div className="col-md-6">
                                        <label className="form-label">Latest Qualification</label>
                                        <input className="form-control" name="latestQualification" value={formData.latestQualification} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Company</label>
                                        <input className="form-control" name="lastCompany" value={formData.lastCompany} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <hr />
                                <h6>Personal Details</h6>
                                <div className="mb-2">
                                    <label className="form-label">Address</label>
                                    <textarea className="form-control" name="address" rows={2} value={formData.address} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-6"><label className="form-label">Nationality</label><input className="form-control" name="nationality" value={formData.nationality} onChange={handleInputChange} /></div>
                                    <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} /></div>
                                    <div className="col-md-6"><label className="form-label">Father</label><input className="form-control" name="father" value={formData.father} onChange={handleInputChange} /></div>
                                    <div className="col-md-6"><label className="form-label">Mother</label><input className="form-control" name="mother" value={formData.mother} onChange={handleInputChange} /></div>
                                    <div className="col-md-6"><label className="form-label">Spouse</label><input className="form-control" name="spouse" value={formData.spouse} onChange={handleInputChange} /></div>
                                    <div className="col-md-6"><label className="form-label">Children</label><input className="form-control" name="children" value={formData.children} onChange={handleInputChange} /></div>
                                </div>

                                <hr />
                                <h6>Qualifications</h6>
                                {qualifications.map((q, i) => (
                                    <div key={i} className="row g-1 mb-1 small">
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Level" value={q.level} onChange={e => { const n = [...qualifications]; n[i].level = e.target.value; setQualifications(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Subject" value={q.subject} onChange={e => { const n = [...qualifications]; n[i].subject = e.target.value; setQualifications(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Institution" value={q.institution} onChange={e => { const n = [...qualifications]; n[i].institution = e.target.value; setQualifications(n); }} /></div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary mb-2" onClick={addQualification}>+ Add Qualification</button>

                                <hr />
                                <h6>Past Experience</h6>
                                {experiences.map((e, i) => (
                                    <div key={i} className="row g-1 mb-1 small">
                                        <div className="col"><input className="form-control form-control-sm" placeholder="From Year" type="number" value={e.fromYear || ''} onChange={ev => { const n = [...experiences]; n[i].fromYear = parseInt(ev.target.value) || 0; setExperiences(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="To Year" type="number" value={e.toYear || ''} onChange={ev => { const n = [...experiences]; n[i].toYear = parseInt(ev.target.value) || 0; setExperiences(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Company" value={e.company} onChange={ev => { const n = [...experiences]; n[i].company = ev.target.value; setExperiences(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Role" value={e.roleTitle} onChange={ev => { const n = [...experiences]; n[i].roleTitle = ev.target.value; setExperiences(n); }} /></div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary mb-2" onClick={addExperience}>+ Add Experience</button>

                                <hr />
                                <h6>Certifications</h6>
                                {certifications.map((c, i) => (
                                    <div key={i} className="row g-1 mb-1 small">
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Title" value={c.title} onChange={e => { const n = [...certifications]; n[i].title = e.target.value; setCertifications(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Authority" value={c.authority} onChange={e => { const n = [...certifications]; n[i].authority = e.target.value; setCertifications(n); }} /></div>
                                        <div className="col"><input className="form-control form-control-sm" placeholder="Year" type="number" value={c.year || ''} onChange={e => { const n = [...certifications]; n[i].year = parseInt(e.target.value) || 0; setCertifications(n); }} /></div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary mb-2" onClick={addCertification}>+ Add Certification</button>

                                <div className="mt-3">
                                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Candidate'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Existing Candidates */}
                <div className="col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Existing Candidates</h5>
                            {isLoading ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm align-middle">
                                        <thead>
                                            <tr><th>ID</th><th>Name</th><th>Expertise</th><th>Last Company</th><th></th></tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map(c => (
                                                <tr key={c.id}>
                                                    <td>{c.id}</td>
                                                    <td>{c.fullName}</td>
                                                    <td>{c.expertise}</td>
                                                    <td>{c.lastCompany}</td>
                                                    <td>
                                                        <Link
                                                            className="btn btn-sm btn-outline-secondary"
                                                            to="/admin"
                                                            onClick={() => handleOpenCandidate(c.id!)}
                                                        >
                                                            Open
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            {candidates.length === 0 && (
                                                <tr><td colSpan={5} className="text-muted">No candidates yet.</td></tr>
                                            )}
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
}
