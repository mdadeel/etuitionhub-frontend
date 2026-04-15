import CountUp from 'react-countup';

const stats = [
    { value: 500, label: 'Active Tutors', suffix: '+' },
    { value: 2000, label: 'Happy Students', suffix: '+' },
    { value: 100, label: 'Subjects', suffix: '+' },
    { value: 50, label: 'Districts Covered', suffix: '+' }
];

/**
 * Statistics Component
 * Technical Refactor: Tabular numbers, high-contrast, sharp Emerald accents.
 */
function Statistics() {
    return (
        <section className="py-24 bg-background border-y border-border overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 0), linear-gradient(currentColor 1px, transparent 0)', backgroundSize: '100px 100px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
                    {stats.map((stat, i) => (
                        <div key={i} className={`flex flex-col items-center lg:items-start lg:px-12 ${i !== 0 ? 'lg:border-l lg:border-border' : ''}`}>
                            <div className="text-6xl font-black text-primary tracking-tighter tabular-nums flex items-baseline gap-1">
                                <CountUp end={stat.value} duration={2.5} separator="," />
                                <span className="text-3xl text-muted-foreground">{stat.suffix}</span>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">
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
