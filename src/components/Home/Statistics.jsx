import CountUp from 'react-countup';

const stats = [
    { value: 500, label: 'Active Nodes', suffix: '+' },
    { value: 2000, label: 'Processed Flows', suffix: '+' },
    { value: 100, label: 'Specializations', suffix: '+' },
    { value: 50, label: 'Zones Covered', suffix: '+' }
];

/**
 * Statistics Component
 * Refactored to "Apple High-Precision Metrics"
 * Features: High-contrast typography, balanced spacing, Apple Blue highlights.
 */
function Statistics() {
    return (
        <section className="py-20 bg-white dark:bg-apple-gray-900 border-y border-apple-gray-100 dark:border-apple-gray-800">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center lg:items-start">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl md:text-5xl font-bold text-apple-gray-900 dark:text-white tracking-tighter tabular-nums">
                                    <CountUp end={stat.value} duration={2.5} separator="," />
                                </span>
                                <span className="text-2xl font-bold text-apple-blue">{stat.suffix}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-apple-gray-400 mt-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Statistics;
