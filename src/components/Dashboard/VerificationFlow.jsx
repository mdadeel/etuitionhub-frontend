import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, CheckCircle, Clock, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
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

    const uploadToFirebase = (file, path) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(p);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nidFile || !certFile) {
            toast.error('Please upload both NID and Certificate');
            return;
        }

        setUploading(true);
        try {
            // Upload NID
            const nidUrl = await uploadToFirebase(
                nidFile, 
                `verifications/${user.uid}/nid_${Date.now()}`
            );
            
            // Upload Certificate
            const certUrl = await uploadToFirebase(
                certFile, 
                `verifications/${user.uid}/cert_${Date.now()}`
            );

            // Update Backend
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
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={40} className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#111827] mb-3">Verification Pending</h2>
                <p className="text-[#5B6475] mb-6">
                    Your documents have been submitted and are currently under review by our admin team. This usually takes 24-48 hours.
                </p>
                <Button variant="outline" disabled>Under Review</Button>
            </Card>
        );
    }

    if (status === 'verified_basic' || status === 'verified_premium') {
        return (
            <Card className="p-10 text-center max-w-xl mx-auto mt-10 border-emerald-200">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#111827] mb-3">You are Verified!</h2>
                <p className="text-[#5B6475] mb-6">
                    Your profile has the verified badge. This helps build trust with students and increases your booking rate.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                    <ShieldCheck size={18} /> Verified Tutor
                </div>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 px-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Tutor Verification</h2>
                <p className="text-sm text-[#5B6475] mt-1">
                    Upload your documents to get the verified badge and increase your visibility.
                </p>
            </div>

            <Card className="p-6 md:p-10">
                <div className="flex items-start gap-4 p-4 mb-8 bg-blue-50 text-blue-800 rounded-xl">
                    <AlertCircle size={24} className="shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">
                        <strong>Why verify?</strong> Verified tutors appear higher in search results and receive 3x more bookings. Your documents are encrypted and only accessible by admins.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* NID Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#111827]">National ID / Passport</label>
                        <div className="border-2 border-dashed border-[rgba(15,23,46,0.15)] rounded-2xl p-8 text-center hover:bg-[#F9FAFB] transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'nid')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            />
                            <ImageIcon size={32} className="mx-auto text-[#5B6475] mb-3 opacity-50" />
                            {nidFile ? (
                                <p className="text-sm font-medium text-[#2563EB]">{nidFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-[#111827] font-medium mb-1">Click to upload NID</p>
                                    <p className="text-xs text-[#5B6475]">JPG, PNG or PDF (Max. 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Certificate Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#111827]">Latest Academic Certificate</label>
                        <div className="border-2 border-dashed border-[rgba(15,23,46,0.15)] rounded-2xl p-8 text-center hover:bg-[#F9FAFB] transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'cert')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            />
                            <FileText size={32} className="mx-auto text-[#5B6475] mb-3 opacity-50" />
                            {certFile ? (
                                <p className="text-sm font-medium text-[#2563EB]">{certFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-[#111827] font-medium mb-1">Click to upload Certificate</p>
                                    <p className="text-xs text-[#5B6475]">JPG, PNG or PDF (Max. 5MB)</p>
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
                            <div className="w-full h-2 bg-[#EEF2F6] rounded-full overflow-hidden">
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
