export default function SkeletonCard() {
    return (
        <article
            className="w-full max-w-[850px] bg-card border border-border rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6 animate-fade-in-up"
            role="status"
            aria-label="Generating response..."
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="size-5 rounded-[4px] shimmer-bg" />
                <div className="h-3 w-[160px] rounded shimmer-bg" />
            </div>
            <div className="mb-4">
                <div className="h-[22px] w-[70%] rounded shimmer-bg" />
            </div>
            <div className="space-y-3">
                <div className="h-4 w-full rounded shimmer-bg" />
                <div className="h-4 w-[92%] rounded shimmer-bg" />
                <div className="h-4 w-[85%] rounded shimmer-bg" />
                <div className="h-4 w-[60%] rounded shimmer-bg" />
            </div>
        </article>
    );
}
