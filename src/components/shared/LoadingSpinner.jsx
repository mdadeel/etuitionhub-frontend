/**
 * LoadingSpinner Component
 * Refactored to "Technical Emerald Minimalism"
 */
const LoadingSpinner = ({ size = 'lg', fullScreen = true }) => {
    const containerClass = fullScreen
        ? 'min-h-[70vh] flex items-center justify-center bg-background'
        : 'flex justify-center py-24';

    const sizeClass = size === 'lg' ? 'w-16 h-16' : 'w-8 h-8';

    return (
        <div className={containerClass}>
            <div className="relative">
                {/* Outer Technical Ring */}
                <div className={`${sizeClass} border-4 border-primary/10 border-t-primary rounded-none animate-spin transition-all duration-1000`}></div>
                
                {/* Inner Static Protocol Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-primary animate-pulse"></div>
                </div>

                <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-primary uppercase tracking-[0.4em] whitespace-nowrap opacity-50 animate-pulse">
                    Synchronizing...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
