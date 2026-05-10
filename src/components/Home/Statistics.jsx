import CountUp from 'react-countup';

const stats = [
    { value: 2500, label: 'Active tutors', suffix: '+' },
    { value: 15000, label: 'Students matched', suffix: '+' },
    { value: 50, label: 'Subjects', suffix: '+' },
    { value: 10, label: 'Cities', suffix: '+' },
    { value: 15, label: 'Avg response (min)', suffix: '' }
];

const Statistics = () => {
    return (
        <section className="py-10 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <span className="text-2xl font-bold text-slate-900">
                                {stat.suffix ? (
                                    <CountUp end={stat.value} duration={2} separator="," />
                                ) : (
                                    stat.value
                                )}
                                {stat.suffix}
                            </span>
                            <span className="text-sm text-slate-500 ml-2">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;