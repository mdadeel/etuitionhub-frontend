import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ConfirmDetailsPanel = ({ connection, onConfirmed }) => {
  const [submitting, setSubmitting] = useState(false);
  const d = connection.proposedDetails;
  const dayName = (n) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][n];

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connection._id}/confirm`);
      toast.success('Confirmed — awaiting payment');
      onConfirmed?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Your tutor proposed:</p>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div><dt className="font-medium">Subject</dt><dd>{d.subject}</dd></div>
        <div><dt className="font-medium">Fee</dt><dd>৳{d.fee?.amount?.toLocaleString()} / month</dd></div>
        <div><dt className="font-medium">Frequency</dt><dd>{d.schedule?.frequency}</dd></div>
        <div><dt className="font-medium">Duration</dt><dd>{d.schedule?.durationMinutes} min</dd></div>
        <div className="col-span-2">
          <dt className="font-medium">Days</dt>
          <dd>{d.schedule?.daysOfWeek?.map(dayName).join(', ')}</dd>
        </div>
        <div><dt className="font-medium">Time</dt><dd>{d.schedule?.preferredTime}</dd></div>
        <div><dt className="font-medium">Method</dt><dd>{d.teachingMethod}</dd></div>
      </dl>
      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-success text-white rounded-md hover:bg-success disabled:opacity-50"
      >
        <CheckCircle size={16} />
        {submitting ? 'Confirming…' : 'Confirm details'}
      </button>
    </div>
  );
};

export default ConfirmDetailsPanel;
