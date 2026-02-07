import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/candidateService';
import type { User } from '../../types';

export default function MembersPage() {
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        role: 'member' as 'admin' | 'member'
    });

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setIsLoading(true);
        const list = await userService.listAll();
        setMembers(list);
        setIsLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.username || !formData.password) {
            setMessage({ type: 'danger', text: 'All fields are required.' });
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.create({
                fullName: formData.fullName,
                username: formData.username,
                password: formData.password,
                role: formData.role
            });
            setMessage({ type: 'success', text: 'User created successfully!' });
            setFormData({ fullName: '', username: '', password: '', role: 'member' });
            loadMembers();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to create user.';
            setMessage({ type: 'danger', text: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Board Members</h2>
                <Link className="btn btn-outline-secondary" to="/admin">Back to Dashboard</Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible`}>
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
            )}

            <div className="row g-3">
                {/* Add Member Form */}
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Add Member</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-control" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Username</label>
                                    <input className="form-control" name="username" value={formData.username} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select className="form-select" name="role" value={formData.role} onChange={handleInputChange}>
                                        <option value="member">Member</option>
                                        <option value="admin">Admin / HR Manager</option>
                                    </select>
                                    <div className="form-text">Only one admin is recommended in real use.</div>
                                </div>
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create User'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Existing Users */}
                <div className="col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Existing Users</h5>
                            {isLoading ? (
                                <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm align-middle">
                                        <thead>
                                            <tr><th>ID</th><th>Name</th><th>Username</th><th>Role</th><th>Created</th></tr>
                                        </thead>
                                        <tbody>
                                            {members.map(m => (
                                                <tr key={m.id}>
                                                    <td>{m.id}</td>
                                                    <td>{m.fullName}</td>
                                                    <td>{m.username}</td>
                                                    <td>
                                                        <span className={`badge text-bg-${m.role === 'admin' ? 'warning' : 'secondary'}`}>
                                                            {m.role}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted small">{new Date(m.createdAt).toLocaleDateString()}</td>
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
}
