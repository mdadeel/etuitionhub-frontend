import CountUp from 'react-countup';

const stats = [
    { value: 1200, label: 'Verified Tutors', suffix: '+' },
    { value: 850, label: 'Active Students', suffix: '+' },
    { value: 100, label: 'Specializations', suffix: '+' },
    { value: 4.9, label: 'Satisfaction', suffix: '/5', decimals: 1 }
];

const Statistics = () => {
    return (
        <section className="py-16 md:py-20 border-y border-border/50">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-start">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl md:text-5xl font-bold tracking-tight tabular-nums">
                                    <CountUp end={stat.value} duration={2} decimals={stat.decimals || 0} separator="," />
                                </span>
                                <span className="text-lg md:text-xl font-bold text-primary">{stat.suffix}</span>
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-2">
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
