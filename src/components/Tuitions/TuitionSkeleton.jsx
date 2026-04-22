const TuitionSkeleton = () => {
    return (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col h-full animate-pulse">
            <div className="p-6 flex-grow space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-muted rounded-lg"></div>
                    <div className="h-4 w-4 bg-muted rounded-full"></div>
                </div>
                <div className="h-7 w-3/4 bg-muted rounded-lg"></div>
                <div className="space-y-3">
                    <div className="h-3 w-full bg-muted rounded-lg"></div>
                    <div className="h-3 w-5/6 bg-muted rounded-lg"></div>
                </div>
                <div className="pt-6 border-t border-border/50 space-y-4">
                    <div className="flex justify-between">
                        <div className="h-3 w-24 bg-muted rounded-lg"></div>
                        <div className="h-3 w-20 bg-muted rounded-lg"></div>
                    </div>
                    <div className="h-3 w-32 bg-muted rounded-lg"></div>
                </div>
            </div>
            <div className="px-6 pb-6">
                <div className="h-12 w-full bg-muted rounded-2xl"></div>
            </div>
        </div>
    );
};

export const TuitionGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <TuitionSkeleton key={i} />
            ))}
        </div>
    );
};

export default TuitionSkeleton;
