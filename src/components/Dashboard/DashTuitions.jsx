// tuition management dashboard - admin approve/reject
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

var isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

// demo data fallback
var demoTuitions = [
    { _id: 'demo1', subject: 'Mathematics', class_name: 'Class 10', location: 'Dhanmondi', salary: 5000, student_email: 'student@demo.com', status: 'pending' },
    { _id: 'demo2', subject: 'Physics', class_name: 'HSC', location: 'Uttara', salary: 7000, student_email: 'student2@demo.com', status: 'approved' }
];

function DashTuitions() {
    let [tuitions, setTuitions] = useState([]);
    let [loading, setLoading] = useState(true);
    let [filter, setFilter] = useState('all');

    useEffect(() => {
        var loadTuitions = async () => {
            console.log('loading tuitions...'); // debug
            try {
                var res = await api.get('/api/tuitions');
                setTuitions(res.data);
            } catch (err) {
                console.error('load failed:', err.message);
                toast.error('Could not load tuitions');
                setTuitions(demoTuitions); // fallback
            } finally {
                setLoading(false);
            }
        };
        loadTuitions();
    }, []);

    // filtered list
    var filtered = useMemo(() => {
        if (filter === 'all') return tuitions;
        return tuitions.filter(t => t.status === filter);
    }, [tuitions, filter]);

    // approve handler
    var handleApprove = async (id) => {
        if (!isValidId(id)) {
            toast.error('Cannot approve demo tuitions');
            return;
        }

        var backup = [...tuitions];
        setTuitions(prev => prev.map(t => t._id === id ? { ...t, status: 'approved' } : t));

        try {
            await api.patch(`/api/tuitions/${id}`, { status: 'approved' });
            toast.success('Approved!');
        } catch (err) {
            setTuitions(backup);
            toast.error('Approval failed');
        }
    };

    // reject handler
    var handleReject = async (id) => {
        if (!confirm('Reject this tuition?')) return;

        if (!isValidId(id)) {
            toast.error('Cannot reject demo tuitions');
            return;
        }

        var backup = [...tuitions];
        setTuitions(prev => prev.map(t => t._id === id ? { ...t, status: 'rejected' } : t));

        try {
            await api.patch(`/api/tuitions/${id}`, { status: 'rejected' });
            toast.success('Rejected');
        } catch (err) {
            setTuitions(backup);
            toast.error('Rejection failed');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Tuition Management</h2>
            <p className="text-gray-600 mb-6">Total Posts: {tuitions.length}</p>

            {/* filter */}
            <div className="flex gap-2 mb-4">
                <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All</button>
                <button className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
                <button className={`btn btn-sm ${filter === 'approved' ? 'btn-success' : ''}`} onClick={() => setFilter('approved')}>Approved</button>
            </div>

            {/* table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr><th>#</th><th>Subject</th><th>Class</th><th>Location</th><th>Salary</th><th>Student</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map((t, i) => {
                            var badgeClass = t.status === 'approved' ? 'badge-success' :
                                t.status === 'rejected' ? 'badge-error' : 'badge-warning';
                            return (
                                <tr key={t._id}>
                                    <th>{i + 1}</th>
                                    <td>{t.subject}</td>
                                    <td>{t.class_name}</td>
                                    <td>{t.location}</td>
                                    <td>৳{t.salary}</td>
                                    <td className="text-sm">{t.student_email}</td>
                                    <td><div className={`badge ${badgeClass}`}>{t.status}</div></td>
                                    <td>
                                        {t.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button className="btn btn-success btn-xs" onClick={() => handleApprove(t._id)}>Approve</button>
                                                <button className="btn btn-error btn-xs" onClick={() => handleReject(t._id)}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashTuitions;
