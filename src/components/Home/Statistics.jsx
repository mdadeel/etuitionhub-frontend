import CountUp from 'react-countup';

const stats = [
    { value: 2500, label: 'Active Tutors', suffix: '+' },
    { value: 15000, label: 'Students Matched', suffix: '+' },
    { value: 50, label: 'Subjects', suffix: '+' },
    { value: 10, label: 'Cities', suffix: '+' },
    { value: 15, label: 'Response (min)', suffix: '' }
];

const Statistics = () => {
    return (
        <section className="py-12 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center md:items-start space-y-1">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                                    <CountUp 
                                        end={stat.value} 
                                        duration={3} 
                                        separator="," 
                                        enableScrollSpy={true}
                                        scrollSpyOnce={true}
                                    />
                                    {stat.suffix}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-0.5 bg-blue-600 rounded-none"></div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;