import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuth } from "../contexts/AuthContext"
import api from '../services/api';
import { getClientConfig } from '../config/clientConfig';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
    Banknote,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Database,
    Send,
    AlertCircle,
    Upload,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import SEO from '@/components/shared/SEO';

const PAYMENT_METHODS = [
    { id: 'bkash', name: 'bKash', color: 'bg-[#D12053]', badge: 'Manual' },
    { id: 'nagad', name: 'Nagad', color: 'bg-[#F7941D]', badge: 'Manual' },
    { id: 'rocket', name: 'Rocket', color: 'bg-[#8C3494]', badge: 'Manual' },
    { id: 'bank', name: 'Bank Transfer', color: 'bg-primary', badge: 'Manual' }
];

const isDemoMethod = (methodId) => ['bkash', 'nagad', 'rocket'].includes(methodId);

// Whether the backend runs in payments demo mode (PAYMENTS_DEMO_MODE=true).
// Off by default — production manual payments are verified by an admin, so the
// "auto-verified for testing" banner must NOT show there.
let paymentsDemoModePromise = null;
const getPaymentsDemoMode = () => {
  if (!paymentsDemoModePromise) {
    paymentsDemoModePromise = getClientConfig()
      .then((cfg) => !!(cfg?.payments?.demoMode))
      .catch(() => false); // config failure → assume production, no demo banner
  }
  return paymentsDemoModePromise;
};

/**
 * Checkout Page
 * Refactored to "Technical Emerald Minimalism"
 */
const Checkout = () => {
    const { id } = useParams();
    const { user, dbUser, loading: authLoading } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const role = dbUser?.role?.toLowerCase();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [application, setApplication] = useState(null);

    const [formData, setFormData] = useState({
        paymentMethod: 'bkash',
        transactionId: '',
        senderNumber: '',
        notes: ''
    });
    const [screenshotFile, setScreenshotFile] = useState(null);
    const [demoMode, setDemoMode] = useState(false);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (!dirty || submitting) return;
        const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [dirty, submitting]);

    useEffect(() => {
        let active = true;
        getPaymentsDemoMode().then((demo) => {
            if (active) setDemoMode(demo);
        });
        return () => { active = false; };
    }, []);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/api/applications/${id}`);
            setApplication(response.data);
            setLoading(false);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError(t('checkout.error_load'));
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id || !user?.email) {
            toast.error(t('checkout.error_session'));
            navigate('/dashboard');
            return;
        }
        fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

     const handleChange = (e) => {
         setFormData(prev => ({
             ...prev,
             [e.target.name]: e.target.value
         }));
         setDirty(true);
     };

     const handleScreenshotChange = (e) => {
         const file = e.target.files?.[0];
         if (!file) return;
         if (file.size > 5 * 1024 * 1024) {
             toast.error(t('checkout.error_screenshot_size'));
             return;
         }
         if (!file.type.startsWith('image/')) {
             toast.error(t('checkout.error_screenshot_type'));
             return;
         }
         setScreenshotFile(file);
         setDirty(true);
     };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.transactionId.trim()) {
            toast.error(t('checkout.error_tx_required'));
            return;
        }
        if (!formData.senderNumber.trim()) {
            toast.error(t('checkout.error_sender_required'));
            return;
        }

        setSubmitting(true);
        try {
            const paymentData = {
                applicationId: id,
                studentEmail: user.email,
                tutorEmail: application?.tutorEmail,
                tutorName: application?.tutorName,
                amount: application?.expectedSalary,
                paymentMethod: formData.paymentMethod,
                transactionId: formData.transactionId.trim(),
                senderNumber: formData.senderNumber.trim(),
                notes: formData.notes.trim(),
                status: 'pending_verification'
            };

            const response = await api.post('/api/payments/manual', paymentData);

            if (response.status === 201) {
                const paymentId = response.data?._id || response.data?.id;

                // Upload screenshot if selected
                if (screenshotFile && paymentId) {
                    try {
                        const fd = new FormData();
                        fd.append('screenshot', screenshotFile);
                        fd.append('paymentId', paymentId);
                        await api.post('/api/upload/payment-screenshot', fd, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } catch {
                        // Screenshot upload failed — payment still submitted
                    }
                }

                toast.success(t('checkout.success_submitted'));
                setDirty(false);
                navigate(paymentId ? `/payment-success?payment_id=${paymentId}` : '/payment-success');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || t('checkout.error_submit');
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;
    if (role === "tutor") return <Navigate to="/dashboard" replace />;

    if (loading && !application) return <LoadingSpinner />;

    if (error && !application) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-8 selection:bg-primary/30 selection:text-primary">
                <div className="max-w-md w-full text-center border border-border p-12 bg-muted/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
                    <AlertCircle size={48} className="text-destructive mx-auto mb-8 opacity-20" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-destructive mb-4 italic">{t('checkout.system_alert')}</p>
                    <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic mb-12">{error?.message || error}</h2>
                    <div className="flex flex-col gap-4">
                        <Button onClick={() => navigate('/dashboard')} variant="outline" className="h-14 rounded-none border-border font-black uppercase tracking-widest text-[11px]">{t('checkout.return_to_management')}</Button>
                        <Button onClick={fetchApplication} className="h-14 rounded-none font-black uppercase tracking-widest text-[11px]">{t('checkout.retry_sync')}</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-20 px-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary animate-in fade-in duration-700">
          <SEO title="Checkout | eTuitionBD" noIndex />
            {/* Background Technical Grid Element */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-16 border-b border-border pb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-1 bg-primary"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">{t('checkout.transaction_infra')}</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85]">{t('checkout.title')}</h1>
                        <p className="mt-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">{t('checkout.subtitle')}</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-[11px] font-black uppercase tracking-[0.3em] h-auto p-0 hover:bg-transparent hover:text-primary group">
                        <ArrowLeft size={14} className="mr-2 transition-transform group-hover:-translate-x-1" /> {t('checkout.abort')}
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Payment Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Payment Method Selection */}
                            <div className="space-y-6">
                                <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{t('checkout.payment_protocol')}</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {PAYMENT_METHODS.map(method => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => { setFormData(prev => ({ ...prev, paymentMethod: method.id })); setDirty(true); }}
                                            className={`p-6 border rounded-none text-left transition-all relative overflow-hidden group ${formData.paymentMethod === method.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border bg-background hover:border-primary/30'
                                                }`}
                                        >
                                            <div className="relative z-10 flex items-center gap-4">
                                                <div className={`size-2 rounded-none ${method.color}`}></div>
                                                <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${formData.paymentMethod === method.id ? 'text-primary' : 'text-foreground'}`}>
                                                    {method.name}
                                                </span>
                                                {method.badge && (
                                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded ml-2">
                                                        {t('checkout.manual_badge')}
                                                    </span>
                                                )}
                                            </div>
                                            {formData.paymentMethod === method.id && (
                                                <div className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground">
                                                    <ShieldCheck size={10} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {demoMode && isDemoMethod(formData.paymentMethod) && (
                                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-warning">
                                            <AlertCircle className="size-5" />
                                            <span className="font-medium">{t('checkout.demo_mode')}</span>
                                        </div>
                                        <p className="text-sm text-warning mt-1">
                                            {t('checkout.demo_desc')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{t('checkout.transaction_hash')}</Label>
                                    <Input
                                        type="text"
                                        name="transactionId"
                                        value={formData.transactionId}
                                        onChange={handleChange}
                                        className="h-14 rounded-none border-border bg-muted/20 font-mono text-xs font-bold text-primary focus-visible:ring-primary uppercase tracking-widest"
                                        placeholder={t('checkout.tx_placeholder')}
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{t('checkout.origin_phone')}</Label>
                                    <Input
                                        type="text"
                                        name="senderNumber"
                                        value={formData.senderNumber}
                                        onChange={handleChange}
                                        className="h-14 rounded-none border-border bg-muted/20 font-bold focus-visible:ring-primary tabular-nums"
                                        placeholder="01XXXXXXXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{t('checkout.additional_params')}</Label>
                                <Textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="min-h-[120px] rounded-none border-border bg-muted/20 font-medium focus-visible:ring-primary resize-none p-6 text-sm"
                                    placeholder={t('checkout.notes_placeholder')}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{t('checkout.screenshot_label')}</Label>
                                <div className="border border-border rounded-none bg-muted/20 p-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <Upload size={16} className="text-muted-foreground" />
                                        <span className="text-xs font-bold text-muted-foreground">
                                            {screenshotFile ? screenshotFile.name : t('checkout.click_to_upload')}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleScreenshotChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {screenshotFile && (
                                        <div className="mt-3 flex items-center gap-2 text-xs text-success">
                                            <CheckCircle2 size={12} />
                                            <span>{screenshotFile.name} ({(screenshotFile.size / 1024).toFixed(0)} KB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border">
                                <Button
                                    type="submit"
                                    className="w-full h-16 rounded-none text-[11px] font-black uppercase tracking-[0.3em] shadow-lg flex items-center justify-center gap-3 group/btn"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <div className="size-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {t('checkout.submit_btn')} <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="bg-background border border-border rounded-none shadow-2xl sticky top-24 overflow-hidden group">
                            <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-none -mr-16 -mt-16 rotate-45 transition-transform duration-700 group-hover:scale-110"></div>
                            
                            <div className="p-10 border-b border-border bg-muted/10 relative z-10">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground flex items-center gap-3">
                                    <Database size={14} className="text-primary" /> {t('checkout.yield_summary')}
                                </h3>
                            </div>

                            <div className="p-10 space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('checkout.specialist_entity')}</p>
                                    <p className="text-sm font-black text-foreground uppercase tracking-tight italic">{application?.tutorName}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('checkout.reference_node')}</p>
                                    <p className="text-xs font-mono font-bold text-primary uppercase tracking-widest">#{id?.slice(-12).toUpperCase()}</p>
                                </div>

                                <div className="pt-10 border-t border-border">
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">{t('checkout.total_yield')}</p>
                                    <p className="text-3xl sm:text-5xl font-black text-primary tabular-nums tracking-tighter italic leading-none">
                                        ৳{application?.expectedSalary}
                                    </p>
                                    <p className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mt-4 italic">{t('checkout.monthly_honorarium')}</p>
                                </div>
                            </div>

                            <div className="p-8 bg-primary/5 border-t border-primary/20 flex items-center gap-4 relative z-10">
                                <div className="size-10 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] leading-relaxed">
                                    {t('checkout.verification_protocol')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
