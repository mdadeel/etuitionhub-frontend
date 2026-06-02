/**
 * Compact horizontal progress tracker for payment lifecycle.
 * 4 steps: Submitted → Under Review → Approved → Completed.
 * Rejected: shows rejected indicator instead of step 2 onward.
 */
const ProgressTracker = ({ status }) => {
    const stepMap = {
        pending_verification: { active: 1, done: 0 },
        confirmed: { active: 2, done: 1 },
        commission_applied: { active: 2, done: 1 },
        available_for_withdrawal: { active: 2, done: 1 },
        withdrawn: { active: 3, done: 3 },
        rejected: { active: -1, done: 0 },
    };
    const s = stepMap[status] || { active: 0, done: -1 };

    if (status === 'rejected') {
        return (
            <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-heading font-black uppercase tracking-widest text-red-600">Rejected</span>
            </div>
        );
    }

    const steps = ['Submitted', 'Review', 'Approved', 'Completed'];
    return (
        <div className="flex items-center gap-1">
            {steps.map((label, i) => {
                const isDone = i <= s.done;
                const isActive = i === s.active;
                return (
                    <div key={label} className="flex items-center gap-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`size-1.5 rounded-full ${
                                    isDone
                                        ? 'bg-emerald-500'
                                        : isActive
                                            ? 'bg-amber-500 animate-pulse'
                                            : 'bg-muted-foreground/30'
                                }`}
                            />
                            <span className={`text-[8px] mt-0.5 uppercase tracking-widest font-heading font-black ${
                                isDone ? 'text-emerald-600' : isActive ? 'text-amber-600' : 'text-muted-foreground/50'
                            }`}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-3 h-px ${i < s.done ? 'bg-emerald-500' : i === s.done ? 'bg-amber-500' : 'bg-muted-foreground/30'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressTracker;
