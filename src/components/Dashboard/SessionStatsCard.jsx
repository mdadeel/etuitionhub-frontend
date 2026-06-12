import { Loader2, CheckCircle, Clock, AlertCircle, Timer, BarChart3 } from 'lucide-react';
import useSessionStats from '../../hooks/useSessionStats';
import { cn } from '@/lib/utils';

const SessionStatsCard = () => {
    const { data: stats, isLoading } = useSessionStats();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-4 bg-card border border-border rounded-2xl animate-pulse">
                        <div className="size-8 bg-muted rounded-lg mb-3" />
                        <div className="h-5 bg-muted rounded w-12 mb-1" />
                        <div className="h-3 bg-muted rounded w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        {
            label: 'Total Sessions',
            value: stats.totalSessions || 0,
            icon: BarChart3,
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            label: 'Completed',
            value: stats.completedSessions || 0,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Scheduled',
            value: stats.scheduledSessions || 0,
            icon: Clock,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Cancelled',
            value: stats.cancelledSessions || 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            label: 'Total Hours',
            value: Math.round((stats.totalHours || 0) * 10) / 10,
            icon: Timer,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Avg Duration',
            value: `${Math.round(stats.avgDuration || 0)}m`,
            icon: Clock,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((card) => {
                const CardIcon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="p-4 bg-card border border-border rounded-2xl hover:border-primary/20 transition-colors"
                    >
                        <div className={cn("size-8 rounded-lg flex items-center justify-center mb-3", card.bg)}>
                            <CardIcon size={16} className={card.color} />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                            {card.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default SessionStatsCard;
