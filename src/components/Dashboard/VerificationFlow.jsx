import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Clock, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, Button } from '../ui';
import api from '../../services/api';
import toast from 'react-hot-toast';

const VerificationFlow = () => {
    const { user, dbUser, refreshUserFromDB } = useAuth();
    const [nidFile, setNidFile] = useState(null);
    const [certFile, setCertFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const status = dbUser?.verificationStatus || 'unverified';

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        if (type === 'nid') setNidFile(file);
        if (type === 'cert') setCertFile(file);
    };

    const uploadToBackend = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                if (e.total) setProgress((e.loaded / e.total) * 100);
            },
        });
        return res.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nidFile || !certFile) {
            toast.error('Please upload both NID and Certificate');
            return;
        }

        setUploading(true);
        try {
            const nidUrl = await uploadToBackend(nidFile);
            const certUrl = await uploadToBackend(certFile);

            const documents = [
                { docUrl: nidUrl, docType: 'National ID' },
                { docUrl: certUrl, docType: 'Certificate' }
            ];

            await api.patch(`/api/users/by-email/${user.email}`, {
                verificationStatus: 'pending_review',
                verificationDocuments: documents
            });

            await refreshUserFromDB(user.email);
            toast.success('Documents submitted successfully!');
            
        } catch (error) {
            console.error('Verification upload failed', error);
            toast.error('Failed to submit documents. Try again.');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    if (status === 'pending_review') {
        return (
            <Card className="p-10 text-center max-w-xl mx-auto mt-10">
                <div className="w-20 h-20 bg-yellow-100 rounded-none flex items-center justify-center mx-auto mb-6">
                    <Clock size={40} className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Verification Pending</h2>
                <p className="text-muted-foreground mb-6">
                    Your documents have been submitted and are currently under review by our admin team. This usually takes 24-48 hours.
                </p>
                <Button variant="outline" disabled>Under Review</Button>
            </Card>
        );
    }

    if (status === 'verified_basic' || status === 'verified_premium') {
        return (
            <Card className="p-10 text-center max-w-xl mx-auto mt-10 border-emerald-200">
                <div className="w-20 h-20 bg-emerald-100 rounded-none flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">You are Verified!</h2>
                <p className="text-muted-foreground mb-6">
                    Your profile has the verified badge. This helps build trust with students and increases your booking rate.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-none font-semibold">
                    <ShieldCheck size={18} /> Verified Tutor
                </div>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 px-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Tutor Verification</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Upload your documents to get the verified badge and increase your visibility.
                </p>
            </div>

            <Card className="p-6 md:p-10">
                <div className="flex items-start gap-4 p-4 mb-8 bg-blue-50 text-blue-800 rounded-none">
                    <AlertCircle size={24} className="shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">
                        <strong>Why verify?</strong> Verified tutors appear higher in search results and receive 3x more bookings. Your documents are encrypted and only accessible by admins.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* NID Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground">National ID / Passport</label>
                        <div className="border-2 border-dashed border-border rounded-none p-8 text-center hover:bg-[#F9FAFB] transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'nid')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            />
                            <ImageIcon size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                            {nidFile ? (
                                <p className="text-sm font-medium text-[#2563EB]">{nidFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-foreground font-medium mb-1">Click to upload NID</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF (Max. 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Certificate Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground">Latest Academic Certificate</label>
                        <div className="border-2 border-dashed border-border rounded-none p-8 text-center hover:bg-[#F9FAFB] transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'cert')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            />
                            <FileText size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                            {certFile ? (
                                <p className="text-sm font-medium text-[#2563EB]">{certFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-foreground font-medium mb-1">Click to upload Certificate</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG or PDF (Max. 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-[#2563EB]">
                                <span>Uploading documents...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-none overflow-hidden">
                                <div 
                                    className="h-full bg-[#2563EB] transition-all duration-300" 
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold"
                        disabled={uploading || !nidFile || !certFile}
                    >
                        {uploading ? 'Submitting...' : 'Submit for Verification'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default VerificationFlow;
