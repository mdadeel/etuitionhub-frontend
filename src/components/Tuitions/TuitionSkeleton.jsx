const TuitionSkeleton = () => {
    return (
        <div className="apple-card flex flex-col h-full bg-white dark:bg-apple-gray-900 border-apple-gray-100 dark:border-apple-gray-800 animate-pulse">
            <div className="p-4 flex-grow space-y-4">
                <div className="flex justify-between items-center">
                    <div className="h-4 w-16 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                    <div className="h-4 w-4 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-full"></div>
                </div>
                <div className="h-5 w-3/4 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                    <div className="h-3 w-5/6 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                </div>
                <div className="pt-4 border-t border-apple-gray-100 dark:border-apple-gray-800 space-y-3">
                    <div className="flex justify-between">
                        <div className="h-3 w-20 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                        <div className="h-3 w-16 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                    </div>
                    <div className="h-3 w-24 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-md"></div>
                </div>
            </div>
            <div className="px-4 pb-4">
                <div className="h-8 w-full bg-apple-gray-100 dark:bg-apple-gray-800 rounded-full"></div>
            </div>
        </div>
    );
};

export const TuitionGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {[...Array(8)].map((_, i) => (
                <TuitionSkeleton key={i} />
            ))}
        </div>
    );
};

export default TuitionSkeleton;
