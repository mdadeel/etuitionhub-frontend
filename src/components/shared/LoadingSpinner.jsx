/**
 * LoadingSpinner Component
 * Consistent loading state across app
 */

const LoadingSpinner = ({ size = 'lg', fullScreen = true }) => {
    const containerClass = fullScreen
        ? 'min-h-screen flex items-center justify-center'
        : 'flex justify-center py-12';

    return (
        <div className={containerClass}>
            <span className={`loading loading-spinner loading-${size} text-teal-600`}></span>
        </div>
    );
};

export default LoadingSpinner;
