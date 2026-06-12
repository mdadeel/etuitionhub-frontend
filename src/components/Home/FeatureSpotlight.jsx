import { Target, Bell, Headphones, User, CheckCircle, Mail, Eye, Zap, BarChart3, MessageCircle } from 'lucide-react';

const subjects = [
    { name: "Math", pct: 88, fill: "from-primary to-blue-400" },
    { name: "Science", pct: 72, fill: "from-accent to-amber-400" },
    { name: "English", pct: 45, fill: "from-primary to-blue-400" },
    { name: "Bangla", pct: 68, fill: "from-emerald-500 to-emerald-400" },
    { name: "ICT", pct: 52, fill: "from-primary to-blue-400" },
];

const activities = [
    { text: "Completed Math practice", time: "2h ago", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { text: "New message from tutor", time: "4h ago", icon: Mail, color: "text-primary", bg: "bg-primary/10" },
    { text: "Lesson preview available", time: "Yesterday", icon: Eye, color: "text-accent", bg: "bg-accent/10" },
];

const features = [
    {
        icon: BarChart3,
        title: "Track Progress",
        description: "Monitor performance and improvements over time with our progress tracking tools.",
    },
    {
        icon: Zap,
        title: "Real-time Updates",
        description: "Get instant notifications on your tuition applications, messages, and updates.",
    },
    {
        icon: MessageCircle,
        title: "Dedicated Support",
        description: "Our support team is available 24/7 to help you with any questions or issues.",
    },
];

const RingStat = ({ value, label, color, percent }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative bg-card/60 border border-border/50 rounded-2xl p-6 text-center backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="w-[72px] h-[72px] mx-auto mb-3 relative">
                <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                    <circle
                        cx="36" cy="36" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-heading text-lg font-bold tracking-tight" style={{ color }}>
                    {value}
                </div>
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest relative">{label}</div>
        </div>
    );
};

const FeatureSpotlight = () => {
    return (
        <section className="py-20 md:py-28 bg-background overflow-hidden relative">
            {/* Background gradient accents */}
            <div className="absolute top-0 right-0 size-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 size-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ═══ DASHBOARD ═══ */}
                <div className="rounded-[20px] p-6 md:p-10 border border-border/50 relative overflow-hidden mb-6"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 40%, hsl(var(--accent) / 0.04) 100%)' }}
                >
                    <div className="absolute -top-1/2 -right-[20%] w-[300px] h-[300px] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-end justify-between flex-wrap gap-4 mb-8 relative">
                        <div>
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Learning Dashboard</span>
                            <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mt-1">Weekly Progress</h2>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live &middot; Jun 24 – Jun 30
                        </div>
                    </div>

                    {/* Ring Stats */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 relative">
                        <RingStat value="+12%" label="Growth" color="hsl(var(--accent))" percent={88} />
                        <RingStat value="4" label="Classes" color="hsl(var(--primary))" percent={25} />
                        <RingStat value="6.5" label="Hours" color="hsl(var(--success))" percent={70} />
                    </div>

                    {/* Subject Progress */}
                    <div className="bg-card/50 border border-border/40 rounded-2xl p-5 backdrop-blur-sm relative">
                        <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">Subject Progress</h3>
                        <div className="space-y-3">
                            {subjects.map((s, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-16 text-xs font-medium text-muted-foreground flex-shrink-0">{s.name}</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${s.fill} transition-all duration-1000 ease-out`}
                                            style={{ width: `${s.pct}%` }}
                                        />
                                    </div>
                                    <span className="w-9 text-right text-xs font-semibold font-heading">{s.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ ACTIVITY + LIVE UPDATES ═══ */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Recent Activity */}
                    <div className="bg-card/50 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="px-5 py-3.5 border-b border-border/30 font-heading text-sm font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Recent Activity
                        </div>
                        {activities.map((a, i) => (
                            <div key={i} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors ${i < activities.length - 1 ? 'border-b border-border/20' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.bg}`}>
                                    <a.icon size={14} className={a.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground truncate">{a.text}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Live Updates */}
                    <div className="bg-card/50 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="px-5 py-3.5 border-b border-border/30 font-heading text-sm font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Updates
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/10">
                                <Zap size={14} className="text-emerald-500" />
                            </div>
                            <span className="text-sm text-foreground">New update</span>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
                                <CheckCircle size={14} className="text-primary" />
                            </div>
                            <span className="text-sm text-foreground">Session completed</span>
                        </div>
                    </div>
                </div>

                {/* ═══ FEATURES + TEXT ═══ */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Features Text Area */}
                    <div className="order-1 lg:order-1 lg:col-span-5 space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
                                <span className="text-xs font-medium text-primary uppercase tracking-wide">Our Features</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-heading text-foreground tracking-tight leading-[0.95]">
                                Track Your <br />
                                <span className="text-primary">Learning</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed font-body">
                                Take control of your educational journey with our comprehensive dashboard. Keep track of tutor interactions, lesson progress, and improvements in one simple, intuitive interface designed for students and parents.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {features.map((feature, idx) => (
                                <div key={idx} className="group flex items-start gap-5 transition-all duration-300 hover:scale-[1.02]">
                                    <div className="shrink-0 size-12 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon size={22} />
                                    </div>
                                    <div className="space-y-2 transition-all duration-300">
                                        <h3 className="text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-body">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust Badge */}
                        <div className="pt-6 border-t border-border/40">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground font-body">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium">
                                            <User size={12} />
                                        </div>
                                    ))}
                                </div>
                                <span>Trusted by 15,000+ students</span>
                            </div>
                        </div>
                    </div>

                    {/* Glass Feature Cards */}
                    <div className="order-2 lg:order-2 lg:col-span-7 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="group bg-card/40 border border-border/40 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/25 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <f.icon size={22} />
                                    </div>
                                    <h3 className="font-heading text-base font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-body">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeatureSpotlight;
