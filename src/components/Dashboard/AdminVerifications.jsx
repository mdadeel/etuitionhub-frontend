import { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const AdminVerifications = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingVerifications = async () => {
        try {
            const res = await api.get('/api/users?verificationStatus=pending_review&limit=50');
            setPendingUsers(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch pending verifications', error);
            toast.error('Could not load pending verifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const handleAction = async (userId, action) => {
        const newStatus = action === 'approve' ? 'verified_basic' : 'unverified';
        
        try {
            // Update user status
            await api.patch(`/api/users/${userId}`, {
                verificationStatus: newStatus
            });

            // Send In-App Mail Notification
            await api.post('/api/mails/admin/send', {
                userId,
                subject: action === 'approve' ? 'Verification Approved 🎉' : 'Verification Rejected ⚠️',
                body: action === 'approve' 
                    ? 'Congratulations! Your documents have been verified and your profile now has the Verified Badge.'
                    : 'Unfortunately, your verification documents were rejected. Please ensure they are clear and valid, then re-upload.',
                type: 'admin'
            });

            toast.success(`User ${action}d successfully`);
            setPendingUsers(pendingUsers.filter(u => u._id !== userId));

        } catch (error) {
            console.error('Action failed', error);
            toast.error('Failed to process verification');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-none animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[rgba(15,23,46,0.08)] pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-1.5 bg-[#2563EB] rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-[#2563EB]">Verifications</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-[#111827]">Pending Verifications</h2>
                    <p className="text-xs text-[#5B6475] mt-1">Review tutor documents to grant the verified badge.</p>
                </div>
                <div className="px-4 py-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-none text-[10px] font-heading font-black uppercase tracking-widest flex items-center gap-2 w-fit">
                    <ShieldAlert size={12} />
                    {pendingUsers.length} Pending
                </div>
            </header>

            {pendingUsers.length === 0 ? (
                <div className="border border-[rgba(15,23,46,0.12)] p-12 text-center bg-[#F8FAFC] rounded-none relative overflow-hidden group">
                    <CheckCircle size={40} className="mx-auto mb-4 text-emerald-500/30" strokeWidth={1} />
                    <h3 className="text-sm font-heading font-black uppercase tracking-widest text-[#111827]">All caught up!</h3>
                    <p className="text-xs text-[#5B6475] mt-1">There are no pending verification requests.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingUsers.map(user => (
                        <div key={user._id} className="border border-[rgba(15,23,46,0.12)] rounded-none bg-white p-6 shadow-none flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-10 w-10 rounded-none border border-[rgba(15,23,46,0.12)] shadow-none">
                                        <AvatarImage src={user.photoURL} className="object-cover rounded-none" />
                                        <AvatarFallback className="bg-slate-900 border border-slate-800 rounded-none animate-none" />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-[#111827] text-sm">{user.displayName}</h3>
                                        <p className="text-xs text-[#5B6475] lowercase tracking-tight">{user.email}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6 bg-[#F8FAFC] p-4 rounded-none border border-[rgba(15,23,46,0.06)]">
                                    <h4 className="text-[9px] font-heading font-black text-[#111827] uppercase tracking-widest">Uploaded Documents</h4>
                                    {user.verificationDocuments && user.verificationDocuments.length > 0 ? (
                                        user.verificationDocuments.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-[#5B6475]">{doc.docType}</span>
                                                <a 
                                                    href={doc.docUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                                                >
                                                    View File <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-[#5B6475]/40 italic">No documents attached.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    className="flex-1 h-10 rounded-none border border-[#2563EB] bg-[#2563EB] text-white text-[9px] font-heading font-black uppercase tracking-widest hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2"
                                    onClick={() => handleAction(user._id, 'approve')}
                                >
                                    Approve
                                </button>
                                <button 
                                    className="flex-1 h-10 rounded-none text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 text-[9px] font-heading font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    onClick={() => handleAction(user._id, 'reject')}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVerifications;
