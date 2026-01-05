/**
 * LoadingSpinner Component
 * Consistent loading state across app
 */

const LoadingSpinner = ({ size = 'lg', fullScreen = true }) => {
    const containerClass = fullScreen
        ? 'min-h-[50vh] flex items-center justify-center'
        : 'flex justify-center py-24';

    const sizeClass = size === 'lg' ? 'w-12 h-12' : 'w-6 h-6';

    return (
        <div className={containerClass}>
            <div className={`${sizeClass} border-2 border-indigo-600 border-t-transparent rounded-full animate-spin`}></div>
        </div>
    );
};

export default LoadingSpinner;
