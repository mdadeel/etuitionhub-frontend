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
        <section className="py-16 bg-teal-600 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl font-bold">
                                <CountUp end={stat.value} duration={2.5} />{stat.suffix}
                            </div>
                            <p className="mt-2 opacity-80">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Statistics;
