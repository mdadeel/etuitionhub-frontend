import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const REPORT_REASONS = [
  'Inappropriate behavior',
  'Fake profile',
  'Harassment',
  'Spam or scam',
  'Incorrect information',
  'Other',
];

const ReportModal = ({ isOpen, onClose, reportedId, onSuccess }) => {
  const { t } = useTranslation();
  const [reasonCategory, setReasonCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonCategory) {
      toast.error(t('tutorDetails.report_reason_required'));
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/api/v1/moderation/reports', {
        reportedId,
        reasonCategory,
        description: description.trim(),
      });
      toast.success(t('tutorDetails.report_submitted'));
      setReasonCategory('');
      setDescription('');
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.error || t('tutorDetails.report_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {t('tutorDetails.report')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('tutorDetails.report_reason')}
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
            >
              <option value="">{t('tutorDetails.report_select')}</option>
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('tutorDetails.report_description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('tutorDetails.report_desc_placeholder')}
              className="w-full h-24 bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              {t('tutorDetails.cancel')}
            </Button>
            <Button type="submit" disabled={submitting || !reasonCategory}>
              {submitting ? t('tutorDetails.reporting') : t('tutorDetails.submit_report')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
