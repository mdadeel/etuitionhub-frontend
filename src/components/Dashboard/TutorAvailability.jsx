import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    Calendar, Plus, Trash2, Clock, Database, Loader2, Check,
    Edit2, Save, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00',
];

/** Single day availability card */
const DayCard = ({ dayData, onDelete, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [startTime, setStartTime] = useState(dayData.startTime || '09:00');
    const [endTime, setEndTime] = useState(dayData.endTime || '17:00');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (startTime >= endTime) { toast.error('Start time must be before end time'); return; }
        setSaving(true);
        try {
            await api.put(`/api/tutors/availability/${dayData.day}`, { startTime, endTime });
            toast.success('Availability updated');
            onUpdate();
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-colors group">
            <div className="flex items-center gap-4 min-w-0">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Calendar size={16} />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground">{dayData.day}</p>
                    {editing ? (
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:border-primary"
                            >
                                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <span className="text-xs text-muted-foreground">to</span>
                            <select
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:border-primary"
                            >
                                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            <Clock size={10} className="inline mr-1" />
                            {dayData.startTime} – {dayData.endTime}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {editing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="size-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                        >
                            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="size-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                        >
                            <X size={13} className="text-muted-foreground" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setEditing(true)}
                            className="size-8 flex items-center justify-center rounded-lg border border-transparent hover:border-border hover:bg-muted transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Edit2 size={13} className="text-muted-foreground" />
                        </button>
                        <button
                            onClick={() => onDelete(dayData.day)}
                            className="size-8 flex items-center justify-center rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={13} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

/** Add new day form */
const AddDayForm = ({ existingDays, onSuccess, onCancel }) => {
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [saving, setSaving] = useState(false);

    const availableDays = DAYS_OF_WEEK.filter(d => !existingDays.includes(d));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!day) { toast.error('Select a day'); return; }
        if (startTime >= endTime) { toast.error('Start time must be before end time'); return; }
        setSaving(true);
        try {
            await api.post('/api/tutors/availability', { day, startTime, endTime });
            toast.success('Availability added');
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add availability');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-primary/20 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-32">
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Day</label>
                    <select
                        value={day}
                        onChange={e => setDay(e.target.value)}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
                    >
                        <option value="">Select day...</option>
                        {availableDays.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-24">
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Start Time</label>
                    <select
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
                    >
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-24">
                    <label className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">End Time</label>
                    <select
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-primary"
                    >
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 text-xs font-heading font-bold uppercase tracking-wider border border-border rounded-lg hover:bg-muted transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-heading font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    Add Day
                </button>
            </div>
        </form>
    );
};

/** Main TutorAvailability component */
const TutorAvailability = ({ tutorId }) => {
    const { dbUser } = useAuth();
    const targetId = tutorId || dbUser?._id;

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const load = useCallback(async () => {
        if (!targetId) return;
        setLoading(true);
        try {
            const res = await api.get(`/api/tutors/${targetId}/availability`);
            setAvailability(res.data || []);
        } catch {
            toast.error('Failed to load availability');
        } finally {
            setLoading(false);
        }
    }, [targetId]);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (day) => {
        if (!confirm(`Remove ${day} from your availability?`)) return;
        try {
            await api.delete(`/api/tutors/availability/${day}`);
            toast.success(`${day} removed`);
            load();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to remove');
        }
    };

    const existingDays = availability.map(a => a.day);

    return (
        <div className="space-y-8 animate-in fade-in-up duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1.5 bg-primary rounded-lg" />
                        <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">Schedule Management</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">My Availability</h2>
                    <p className="text-xs text-muted-foreground">Set the days and times you are available for tutoring sessions.</p>
                </div>

                {existingDays.length < 7 && (
                    <button
                        onClick={() => setShowAddForm(v => !v)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                        <Plus size={14} />
                        Add Day
                    </button>
                )}
            </header>

            {showAddForm && (
                <AddDayForm
                    existingDays={existingDays}
                    onSuccess={() => { setShowAddForm(false); load(); }}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : availability.length === 0 ? (
                <div className="py-24 text-center bg-background border border-border border-dashed rounded-xl">
                    <Calendar size={40} className="text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-sm font-heading font-bold text-muted-foreground mb-2">No availability set</p>
                    <p className="text-xs text-muted-foreground">Click "Add Day" to define when you are available for students.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Summary grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS_OF_WEEK.map(d => {
                            const isSet = existingDays.includes(d);
                            return (
                                <div
                                    key={d}
                                    className={cn(
                                        'flex flex-col items-center gap-1 py-2 rounded-lg text-[9px] font-label font-semibold uppercase tracking-wider transition-colors',
                                        isSet ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground/40'
                                    )}
                                >
                                    <span>{d.slice(0, 3)}</span>
                                    {isSet && <div className="size-1.5 rounded-full bg-primary" />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Day cards */}
                    {availability.map(a => (
                        <DayCard
                            key={a.day}
                            dayData={a}
                            onDelete={handleDelete}
                            onUpdate={load}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TutorAvailability;
