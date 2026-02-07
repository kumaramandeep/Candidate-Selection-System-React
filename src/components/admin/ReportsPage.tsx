import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateService, userService } from '../../services/candidateService';
import { voteService } from '../../services/voteService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Candidate, User } from '../../types';

export default function ReportsPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [marksMap, setMarksMap] = useState<Map<string, number | null>>(new Map());
    const [totals, setTotals] = useState<Map<number, { totalMarks: number; totalVotes: number }>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        setIsLoading(true);
        const [candList, memberList] = await Promise.all([
            candidateService.listBasic(),
            userService.listMembers()
        ]);

        setCandidates(candList);
        setMembers(memberList);

        const marks = await voteService.marksMap(candList, memberList);
        setMarksMap(marks);

        const tots = await voteService.totalsByCandidate(candList);
        setTotals(tots);

        setIsLoading(false);
    };

    const exportCSV = () => {
        const header = ['Candidate ID', 'Candidate Name'];
        members.forEach(m => header.push(`${m.fullName} (@${m.username})`));
        header.push('Total Marks', 'Total Votes');

        const rows = candidates.map(c => {
            const row: (string | number)[] = [c.id!, c.fullName];
            members.forEach(m => {
                const mk = marksMap.get(`${c.id}:${m.id}`);
                row.push(mk !== null && mk !== undefined ? mk : '');
            });
            const t = totals.get(c.id!) || { totalMarks: 0, totalVotes: 0 };
            row.push(t.totalMarks, t.totalVotes);
            return row;
        });

        const csvContent = [header, ...rows]
            .map(r => r.map(v => `"${v}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `candidate_voting_report_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(16);
        doc.text('Candidate Marks Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

        const tableHeaders = ['Candidate', ...members.map(m => m.username), 'Marks', 'Votes'];
        const tableData = candidates.map(c => {
            const row: (string | number)[] = [c.fullName];
            members.forEach(m => {
                const mk = marksMap.get(`${c.id}:${m.id}`);
                row.push(mk !== null && mk !== undefined ? mk : '-');
            });
            const t = totals.get(c.id!) || { totalMarks: 0, totalVotes: 0 };
            row.push(t.totalMarks, t.totalVotes);
            return row;
        });

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 28,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 139, 202] }
        });

        doc.save(`candidate_voting_report_${new Date().toISOString().slice(0, 10)}.pdf`);
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
                    <h2 className="mb-0">Marks Report</h2>
                    <div className="text-muted small">Marks by each member for each candidate (out of 10).</div>
                </div>
                <div className="d-flex gap-2">
                    <Link className="btn btn-outline-secondary" to="/admin">Back to Dashboard</Link>
                    <button className="btn btn-success" onClick={exportCSV}>Export CSV</button>
                    <button className="btn btn-danger" onClick={exportPDF}>Export PDF</button>
                </div>
            </div>

            {candidates.length === 0 ? (
                <div className="alert alert-warning">No candidates found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ minWidth: '240px' }}>Candidate</th>
                                {members.map(m => (
                                    <th key={m.id} style={{ minWidth: '120px' }}>
                                        {m.fullName}
                                        <div className="text-muted small">@{m.username}</div>
                                    </th>
                                ))}
                                <th>Total Marks</th>
                                <th>Total Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map(c => {
                                const t = totals.get(c.id!) || { totalMarks: 0, totalVotes: 0 };
                                return (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="fw-semibold">{c.fullName}</div>
                                            <div className="text-muted small">ID: {c.id}</div>
                                        </td>
                                        {members.map(m => {
                                            const mk = marksMap.get(`${c.id}:${m.id}`);
                                            return (
                                                <td key={m.id} className="text-center">
                                                    {mk !== null && mk !== undefined ? (
                                                        <span className="fw-semibold">{mk}</span>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="text-center fw-bold">{t.totalMarks}</td>
                                        <td className="text-center">{t.totalVotes}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="text-muted small">
                Tip: "Export CSV" downloads a CSV file that opens in Microsoft Excel.
            </div>
        </div>
    );
}
