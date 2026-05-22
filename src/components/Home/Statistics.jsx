import CountUp from 'react-countup';
import { SectionHeader } from '@/components/ui';

const stats = [
    { value: 2500, label: 'Active Tutors', suffix: '+' },
    { value: 15000, label: 'Students Matched', suffix: '+' },
    { value: 50, label: 'Subjects', suffix: '+' },
    { value: 10, label: 'Cities', suffix: '+' },
    { value: 15, label: 'Response (min)', suffix: '' }
];

const Statistics = () => {
    return (
        <section className="py-16 bg-card relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center md:items-start space-y-2">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl md:text-4xl font-heading text-foreground tracking-tight tabular-nums">
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
                                <div className="w-2 h-0.5 bg-[#2563EB] rounded-full"></div>
                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
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
