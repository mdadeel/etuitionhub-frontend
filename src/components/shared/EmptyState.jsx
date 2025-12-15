/**
 * EmptyState Component
 * Consistent empty/no-results state
 */

const EmptyState = ({ message = 'No items found', onAction, actionLabel = 'Clear Filters' }) => {
    return (
        <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{message}</p>
            {onAction && (
                <button className="btn btn-primary mt-4" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
