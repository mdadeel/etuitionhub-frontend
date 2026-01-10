// stats section - countup animation
import CountUp from 'react-countup';

// stats data
var stats = [
    { value: 500, label: 'Active Tutors', suffix: '+' },
    { value: 2000, label: 'Happy Students', suffix: '+' },
    { value: 100, label: 'Subjects', suffix: '+' },
    { value: 50, label: 'Districts Covered', suffix: '+' }
];

function Statistics() {
    // TODO: fetch real stats from api later
    return (
        <section className="py-20 bg-teal-600 dark:bg-teal-900/40 text-white border-y border-teal-500/10 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="text-5xl font-black mb-2 tracking-tight">
                                <CountUp end={stat.value} duration={2.5} separator="," />{stat.suffix}
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-70">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Statistics;
