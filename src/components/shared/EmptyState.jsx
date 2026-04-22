import { SearchX, RefreshCw } from "lucide-react";
import { AppleButton } from "./AppleUI";

const EmptyState = ({ message = 'No specialists found', onAction, actionLabel = 'Reset Filters' }) => {
    return (
        <div className="text-center py-32 bg-muted/20 border border-dashed border-border rounded-[2rem] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-background border border-border shadow-apple-sm rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <SearchX size={32} className="text-muted-foreground/30 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">No Results Found</h3>
                <p className="text-sm font-medium text-muted-foreground mb-10 max-w-xs mx-auto leading-relaxed">
                    {message}
                </p>
                {onAction && (
                    <AppleButton
                        variant="secondary"
                        size="md"
                        className="shadow-apple-sm"
                        onClick={onAction}
                    >
                        <RefreshCw size={14} className="mr-2 opacity-50" />
                        {actionLabel}
                    </AppleButton>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
