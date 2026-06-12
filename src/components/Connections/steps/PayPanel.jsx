import { useState } from 'react';
import { CreditCard, Gift } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const PayPanel = ({ connection, onMarked }) => {
  const [amount, setAmount] = useState(connection.proposedDetails?.fee?.amount || 0);
  const [method, setMethod] = useState('bkash');
  const [txnId, setTxnId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleMarkPaid = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connection._id}/mark-paid`, {
        amount: Number(amount), method, transactionId: txnId
      });
      toast.success('Payment submitted — admin will verify');
      onMarked?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFreeTrial = async () => {
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connection._id}/mark-free-trial`);
      toast.success('Marked as free trial — tutoring is scheduled');
      onMarked?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark free trial');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Choose how to handle payment:</p>
      <form onSubmit={handleMarkPaid} className="space-y-3 border border-border rounded-md p-3">
        <h4 className="text-sm font-medium flex items-center gap-2"><CreditCard size={14} /> Mark as paid</h4>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} className="border border-border rounded-md p-2 text-sm bg-background text-foreground" />
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="border border-border rounded-md p-2 text-sm bg-background text-foreground">
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
            <option value="bank">Bank</option>
          </select>
        </div>
        <input
          type="text" value={txnId} onChange={(e) => setTxnId(e.target.value)}
          placeholder="Transaction ID (optional until admin verifies)"
          className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground"
        />
        <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50">
          Submit payment
        </button>
      </form>
      <button
        type="button"
        onClick={handleFreeTrial}
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-emerald-300 text-emerald-700 rounded-md text-sm hover:bg-emerald-50 disabled:opacity-50"
      >
        <Gift size={14} /> Mark as free trial
      </button>
    </div>
  );
};

export default PayPanel;
