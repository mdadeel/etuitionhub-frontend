const TuitionSkeleton = () => {
    return (
        <div className="flex flex-col h-full bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] animate-pulse">
            <div className="h-48 w-full bg-[var(--color-surface-muted)]"></div>
            <div className="p-5 flex-grow space-y-4">
                <div className="h-4 w-3/4 bg-[var(--color-surface-muted)] rounded"></div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-[var(--color-surface-muted)] rounded"></div>
                    <div className="h-3 w-5/6 bg-[var(--color-surface-muted)] rounded"></div>
                </div>
                <div className="pt-4 border-t border-[var(--color-border)] flex justify-between">
                    <div className="h-3 w-20 bg-[var(--color-surface-muted)] rounded"></div>
                    <div className="h-3 w-16 bg-[var(--color-surface-muted)] rounded"></div>
                </div>
            </div>
            <div className="h-12 w-full bg-[var(--color-surface-muted)]"></div>
        </div>
    );
};

export const TuitionGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <TuitionSkeleton key={i} />
            ))}
        </div>
    );
};

export default TuitionSkeleton;
