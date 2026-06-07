import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { History, Filter, ChevronDown, ChevronRight, Search, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

const ACTION_COLORS = {
    payment_approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    payment_rejected: 'bg-red-100 text-red-800 border-red-300',
    withdrawal_requested: 'bg-blue-100 text-blue-800 border-blue-300',
    withdrawal_approved: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    withdrawal_rejected: 'bg-amber-100 text-amber-800 border-amber-300',
    withdrawal_paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    commission_applied: 'bg-teal-100 text-teal-800 border-teal-300',
};

const ENTITY_COLORS = {
    payment: 'text-primary',
    withdrawal: 'text-amber-600',
    wallet: 'text-emerald-600',
    commission: 'text-teal-600',
};

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        entityType: '',
        userEmail: '',
    });
    const [expanded, setExpanded] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
            const res = await api.get(`/api/audit-logs?${params.toString()}`);
            setLogs(res.data.logs || []);
        } catch {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const loadActions = useCallback(async () => {
        try {
            const res = await api.get('/api/audit-logs/actions');
            setActions(res.data || []);
        } catch { /* non-fatal */ }
    }, []);

    useEffect(() => { loadActions(); }, [loadActions]);
    useEffect(() => { load(); }, [load]);

    const stats = useMemo(() => {
        const byAction = {};
        logs.forEach(l => { byAction[l.action] = (byAction[l.action] || 0) + 1; });
        return Object.entries(byAction).slice(0, 4);
    }, [logs]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-1.5 bg-primary rounded-none"></div>
                        <span className="text-[9px] font-heading font-black uppercase tracking-[0.25em] text-primary">Compliance Trail</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-foreground">Audit Log</h2>
                    <p className="text-xs text-muted-foreground mt-1">Complete history of all admin and system financial actions.</p>
                </div>
                <button
                    onClick={load}
                    className="h-10 px-4 border border-border text-[9px] font-heading font-black uppercase tracking-widest hover:bg-muted transition-colors flex items-center gap-2"
                >
                    <RefreshCw size={12} /> Refresh
                </button>
            </header>

            {/* Quick stats */}
            {stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.map(([action, count]) => (
                        <div key={action} className="bg-card border border-border p-4">
                            <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground truncate">{action.replace(/_/g, ' ')}</p>
                            <p className="text-2xl font-heading font-black text-foreground mt-1 tabular-nums">{count}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="bg-card border border-border p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                    <label className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground mb-1 block">Action</label>
                    <select
                        value={filters.action}
                        onChange={(e) => setFilters(f => ({ ...f, action: e.target.value }))}
                        className="w-full h-10 px-3 border border-border bg-card text-xs"
                    >
                        <option value="">All actions</option>
                        {actions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground mb-1 block">Entity</label>
                    <select
                        value={filters.entityType}
                        onChange={(e) => setFilters(f => ({ ...f, entityType: e.target.value }))}
                        className="w-full h-10 px-3 border border-border bg-card text-xs"
                    >
                        <option value="">All entities</option>
                        <option value="payment">Payment</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="wallet">Wallet</option>
                        <option value="commission">Commission</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground mb-1 block">User email contains</label>
                    <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={filters.userEmail}
                            onChange={(e) => setFilters(f => ({ ...f, userEmail: e.target.value }))}
                            placeholder="e.g. admin"
                            className="w-full h-10 pl-9 pr-3 border border-border bg-card text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? <LoadingSpinner /> : logs.length === 0 ? (
                <div className="bg-card border border-border p-12 text-center">
                    <History size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-xs text-muted-foreground">No audit entries match the current filters.</p>
                </div>
            ) : (
                <div className="bg-card border border-border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground">
                                <th className="px-4 py-3 w-10"></th>
                                <th className="px-4 py-3">When</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Entity</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3 text-right">Entity ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {logs.map(log => (
                                <>
                                    <tr
                                        key={log._id}
                                        onClick={() => setExpanded(expanded === log._id ? null : log._id)}
                                        className="hover:bg-muted/10 transition-colors cursor-pointer"
                                    >
                                        <td className="px-4 py-3 text-center">
                                            {expanded === log._id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "text-[9px] font-heading font-black uppercase tracking-widest px-2 py-1 border rounded-none",
                                                ACTION_COLORS[log.action] || 'bg-muted text-foreground border-border'
                                            )}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn("text-xs font-bold uppercase", ENTITY_COLORS[log.entityType] || 'text-muted-foreground')}>
                                                {log.entityType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-foreground">
                                            <div className="font-mono truncate max-w-[200px]" title={log.userEmail}>{log.userEmail}</div>
                                            <div className="text-[9px] text-muted-foreground uppercase">{log.userRole}</div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-[10px] font-mono text-muted-foreground">{log.entityId?.toString().slice(-8)}</span>
                                        </td>
                                    </tr>
                                    {expanded === log._id && (
                                        <tr key={`${log._id}-detail`} className="bg-muted/20">
                                            <td colSpan={6} className="px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground mb-1">Old values</p>
                                                        <pre className="bg-card border border-border p-3 text-[10px] font-mono overflow-x-auto">
                                                            {log.oldValues ? JSON.stringify(log.oldValues, null, 2) : '(none)'}
                                                        </pre>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-heading font-black uppercase tracking-widest text-muted-foreground mb-1">New values</p>
                                                        <pre className="bg-card border border-border p-3 text-[10px] font-mono overflow-x-auto">
                                                            {log.newValues ? JSON.stringify(log.newValues, null, 2) : '(none)'}
                                                        </pre>
                                                    </div>
                                                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-muted-foreground text-[9px] uppercase tracking-widest font-heading font-black">IP: </span>
                                                            <span className="font-mono text-[10px]">{log.ipAddress || '—'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground text-[9px] uppercase tracking-widest font-heading font-black">UA: </span>
                                                            <span className="font-mono text-[10px] truncate inline-block max-w-[300px] align-middle" title={log.userAgent}>{log.userAgent || '—'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAuditLogs;
