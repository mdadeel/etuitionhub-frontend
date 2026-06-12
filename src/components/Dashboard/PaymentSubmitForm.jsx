import { useState, useRef, useCallback } from 'react';
import api from '../../services/api';
import { X, Upload, Loader2, CheckCircle, AlertCircle, Banknote, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const bkashNumber = import.meta.env.VITE_BKASH_NUMBER || '01XXXXXXXXX';
const nagadNumber = import.meta.env.VITE_NAGAD_NUMBER || '01XXXXXXXXX';

const PaymentSubmitForm = ({ payment, onSubmitted }) => {
  const [method, setMethod] = useState('');
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const grossAmount = payment?.grossAmount || payment?.amount || 0;
  const fee = grossAmount * 0.05;
  const netAmount = grossAmount - fee;

  const handleFile = useCallback((file) => {
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleSubmit = async () => {
    if (!method) { toast.error('Select a payment method'); return; }
    if (!trxId.trim()) { toast.error('Enter transaction ID'); return; }
    if (!senderNumber.trim()) { toast.error('Enter sender phone number'); return; }
    if (!screenshot) { toast.error('Upload payment screenshot'); return; }

    setSubmitting(true);
    try {
      let screenshotUrl = null;

      if (screenshot) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', screenshot);
        const uploadRes = await api.post('/api/upload/payment-screenshot', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        screenshotUrl = uploadRes.data?.url || uploadRes.data?.data?.url;
        setUploading(false);
      }

      await api.patch(`/api/payments/${payment._id}/submit-trx`, {
        paymentMethod: method,
        transactionId: trxId.trim(),
        senderNumber: senderNumber.trim(),
        screenshotURL: screenshotUrl,
      });

      toast.success('Under review — within 24 hours');
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onSubmitted?.()}>
      <div className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-primary rounded-lg" />
            <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Payment Proof</span>
          </div>
          <button onClick={onSubmitted} className="size-8 flex items-center justify-center hover:bg-muted transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Summary */}
          <div className="border border-border bg-background p-5 space-y-3">
            <h3 className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Invoice Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tutor</span>
                <span className="font-semibold text-foreground">{payment?.tutorName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-semibold text-foreground">{payment?.subject || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period</span>
                <span className="font-semibold text-foreground">
                  {payment?.billingPeriodStart ? new Date(payment.billingPeriodStart).toLocaleDateString('en-GB') : '—'} – {payment?.billingPeriodEnd ? new Date(payment.billingPeriodEnd).toLocaleDateString('en-GB') : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-semibold text-foreground">{payment?.sessionsConfirmed || 0}</span>
              </div>
            </div>

            <hr className="border-border my-1" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Amount</span>
                <span className="font-medium text-foreground">৳{grossAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground/70">Platform Fee (5%)</span>
                <span className="text-muted-foreground/70">–৳{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <span className="font-bold text-foreground">Total Due</span>
                <span className="font-bold text-lg text-primary">৳{netAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Merchant Numbers */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-border bg-background p-3">
              <p className="font-label font-semibold uppercase tracking-wider text-[10px] text-[#D12053] mb-1">bKash</p>
              <p className="font-mono font-bold text-foreground">{bkashNumber}</p>
            </div>
            <div className="border border-border bg-background p-3">
              <p className="font-label font-semibold uppercase tracking-wider text-[10px] text-[#F7941D] mb-1">Nagad</p>
              <p className="font-mono font-bold text-foreground">{nagadNumber}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {['bkash', 'nagad'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMethod(opt)}
                  className={cn(
                    'h-12 text-sm font-bold uppercase tracking-wider border transition-all',
                    method === opt
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/30'
                  )}
                >
                  {opt === 'bkash' ? 'bKash' : 'Nagad'}
                </button>
              ))}
            </div>
          </div>

          {/* TRX ID */}
          <div className="space-y-2">
            <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">TRX ID <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="Enter transaction ID"
              className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Sender Number */}
          <div className="space-y-2">
            <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Sender Number <span className="text-destructive">*</span></label>
            <input
              type="tel"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Screenshot <span className="text-destructive">*</span></label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed p-6 text-center cursor-pointer transition-all',
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              )}
            >
              {screenshotPreview ? (
                <div className="relative inline-block">
                  <img src={screenshotPreview} alt="Screenshot preview" className="max-h-48 object-contain mx-auto" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setScreenshot(null); setScreenshotPreview(null); }}
                    className="absolute -top-2 -right-2 size-6 flex items-center justify-center bg-destructive text-destructive-foreground text-xs"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="size-8" />
                  <p className="text-sm font-medium">Drop screenshot here or click to browse</p>
                  <p className="text-[10px]">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onSubmitted}
            className="h-10 px-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="h-10 px-8 bg-primary text-primary-foreground text-[10px] font-label font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting || uploading ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitting ? 'Submitting...' : uploading ? 'Uploading...' : 'Submit Proof'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubmitForm;
