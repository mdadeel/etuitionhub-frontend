const LoadingSpinner = ({ size = 'lg', fullScreen = true }) => {
    const containerClass = fullScreen
        ? 'min-h-[70vh] flex items-center justify-center bg-background'
        : 'flex justify-center py-24';

    const sizeClass = size === 'lg' ? 'w-12 h-12' : 'w-6 h-6';

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Primary Spinner */}
                    <div className={`${sizeClass} border-2 border-primary/20 border-t-primary rounded-full animate-spin transition-all duration-1000 ease-in-out`}></div>
                    
                    {/* Center Dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-40 animate-pulse"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
                        Synchronizing
                    </p>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
