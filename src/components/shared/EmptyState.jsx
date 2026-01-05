/**
 * EmptyState Component
 * Consistent empty/no-results state
 */

const EmptyState = ({ message = 'No items found', onAction, actionLabel = 'Clear Filters' }) => {
    return (
        <div className="text-center py-32 bg-gray-50/50 border border-dashed border-gray-200 rounded-sm">
            <p className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-widest">{message}</p>
            {onAction && (
                <button
                    className="btn-quiet-secondary inline-flex items-center gap-2"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
