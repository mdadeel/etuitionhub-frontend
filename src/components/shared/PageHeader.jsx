/**
 * PageHeader Component
 * Refactored to "Technical Emerald Minimalism"
 */
const PageHeader = ({ title, subtitle, className = "" }) => {
    return (
        <header className={`mb-16 border-b border-border pb-12 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-1 bg-primary"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Interface</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-[0.85] mb-4">
                {title}
            </h1>
            
            {subtitle && (
                <p className="text-sm md:text-base text-muted-foreground font-bold uppercase tracking-tight leading-relaxed max-w-2xl italic">
                    {subtitle}
                </p>
            )}
        </header>
    );
};

export default PageHeader;
