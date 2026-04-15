import { Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * EmptyState Component
 * Refactored to "Technical Emerald Minimalism"
 */
const EmptyState = ({ message = 'No data nodes located', onAction, actionLabel = 'Reset Matrix' }) => {
    return (
        <div className="text-center py-40 bg-muted/10 border border-dashed border-border rounded-none relative overflow-hidden group">
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
                <Database size={48} className="text-muted-foreground/30 mb-8 group-hover:text-primary/30 transition-colors duration-500" strokeWidth={1} />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-10 max-w-xs leading-relaxed">
                    {message.toUpperCase()}
                </p>
                {onAction && (
                    <Button
                        variant="outline"
                        className="h-12 px-8 rounded-none border-border text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group/btn"
                        onClick={onAction}
                    >
                        <RefreshCw size={14} className="mr-2 group-hover/btn:rotate-180 transition-transform duration-700" />
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
