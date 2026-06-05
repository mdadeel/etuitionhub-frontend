import { useState } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const FREQ = ['daily', 'weekly', 'biweekly', 'custom'];
const TIMES = ['morning', 'afternoon', 'evening'];
const METHODS = ['online', 'in_person', 'both'];

const ProposeDetailsForm = ({ connection, onProposed }) => {
  const [subject, setSubject] = useState(connection.proposedDetails?.subject || '');
  const [frequency, setFrequency] = useState(connection.proposedDetails?.schedule?.frequency || 'weekly');
  const [days, setDays] = useState(connection.proposedDetails?.schedule?.daysOfWeek || [1, 3, 5]);
  const [duration, setDuration] = useState(connection.proposedDetails?.schedule?.durationMinutes || 60);
  const [time, setTime] = useState(connection.proposedDetails?.schedule?.preferredTime || 'evening');
  const [amount, setAmount] = useState(connection.proposedDetails?.fee?.amount || 5000);
  const [method, setTeachingMethod] = useState(connection.proposedDetails?.teachingMethod || 'online');
  const [submitting, setSubmitting] = useState(false);

  const toggleDay = (d) => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d]);
  const dayName = (d) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/connections/${connection._id}/propose-details`, {
        subject,
        schedule: { frequency, daysOfWeek: days, durationMinutes: Number(duration), preferredTime: time },
        fee: { amount: Number(amount), currency: 'BDT' },
        teachingMethod: method
      });
      toast.success('Proposal sent — awaiting student confirmation');
      onProposed?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          placeholder="e.g., Physics — HSC 1st year"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border border-border rounded-md p-2 bg-background text-foreground">
            {FREQ.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (min)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min={15} step={15} className="w-full border border-border rounded-md p-2 bg-background text-foreground" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Days of week</label>
        <div className="flex gap-2">
          {[0,1,2,3,4,5,6].map(d => (
            <button
              type="button"
              key={d}
              onClick={() => toggleDay(d)}
              className={`px-2 py-1 text-xs rounded-md border ${days.includes(d) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
            >
              {dayName(d)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Preferred time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-border rounded-md p-2 bg-background text-foreground">
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teaching method</label>
          <select value={method} onChange={(e) => setTeachingMethod(e.target.value)} className="w-full border border-border rounded-md p-2 bg-background text-foreground">
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monthly fee (BDT)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          className="w-full border border-border rounded-md p-2 bg-background text-foreground"
        />
      </div>
      <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
        {submitting ? 'Sending…' : 'Send proposal'}
      </button>
    </form>
  );
};

export default ProposeDetailsForm;
