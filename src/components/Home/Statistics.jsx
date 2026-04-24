import CountUp from 'react-countup';

const stats = [
    { value: 1200, label: 'Verified Tutors', suffix: '+' },
    { value: 850, label: 'Active Students', suffix: '+' },
    { value: 100, label: 'Specializations', suffix: '+' },
    { value: 4.9, label: 'Satisfaction', suffix: '/5', decimals: 1 }
];

const Statistics = () => {
    return (
        <section className="py-24 bg-background border-y border-border/50">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-start" data-aos="fade-up" data-aos-delay={i * 100}>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl md:text-6xl font-bold text-foreground tracking-tight tabular-nums">
                                    <CountUp end={stat.value} duration={2.5} decimals={stat.decimals || 0} separator="," />
                                </span>
                                <span className="text-xl md:text-2xl font-bold text-primary">{stat.suffix}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-3">
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
