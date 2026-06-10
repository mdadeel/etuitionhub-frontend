import countUpModule from 'react-countup';
const CountUp = countUpModule.default || countUpModule;

const stats = [
    { value: 2500, label: 'Active Tutors', suffix: '+' },
    { value: 15000, label: 'Students Matched', suffix: '+' },
    { value: 50, label: 'Subjects', suffix: '+' },
    { value: 10, label: 'Cities', suffix: '+' },
    { value: 15, label: 'Response', suffix: 'min' }
];

const Statistics = () => {
    return (
        <section className="py-12 md:py-16 bg-background relative overflow-hidden">
            {/* Background decorative pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-pattern-academic pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-10 md:mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-tight mb-3">
                        Making an <span className="text-primary">Impact</span>
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground font-body">Our platform has connected thousands of students with perfect tutors</p>
                </div>

                {/* Compact Stats Grid - 3 columns on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center p-4 bg-card border border-border/60 rounded-xl hover:border-primary/20 transition-colors group opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${150 + i * 100}ms` }}
                        >
                            <div className="text-2xl md:text-3xl font-heading text-foreground tracking-tight tabular-nums group-hover:text-primary transition-colors">
                                <CountUp
                                    end={stat.value}
                                    duration={3}
                                    separator=","
                                    enableScrollSpy={true}
                                    scrollSpyOnce={true}
                                />
                                {stat.suffix && <span className="text-lg md:text-xl text-muted-foreground font-body ml-0.5">{stat.suffix}</span>}
                            </div>
                            <span className="text-[10px] md:text-xs font-medium text-muted-foreground text-center mt-2 font-body">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
