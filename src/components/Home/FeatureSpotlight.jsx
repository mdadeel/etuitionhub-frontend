import { Target, Bell, Headphones, User } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: "Track Progress",
        description: "Monitor performance and improvements over time with our progress tracking tools."
    },
    {
        icon: Bell,
        title: "Real-time Updates",
        description: "Get instant notifications on your tuition applications, messages, and updates."
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description: "Our support team is available 24/7 to help you with any questions or issues."
    }
];

const FeatureSpotlight = () => {
    return (
        <section className="py-20 md:py-28 bg-background overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 size-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 size-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Visual Area - Humanized Design */}
                    <div className="relative order-2 lg:order-1 lg:col-span-7 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                        <div className="relative bg-card rounded-2xl border border-border/60 shadow-premium-lg overflow-hidden transition-all duration-500 hover:border-primary/30">
                            {/* Decorative header with gradient */}
                            <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-accent w-full"></div>

                            {/* Browser/Window Header */}
                            <div className="h-12 bg-muted/50 border-b border-border/60 flex items-center px-6 gap-3">
                                <div className="flex gap-2">
                                    <div className="size-3 rounded-full bg-red-500/80"></div>
                                    <div className="size-3 rounded-full bg-amber-500/80"></div>
                                    <div className="size-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground font-body">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-1.5 rounded-full bg-primary"></div>
                                        <span>Learning Dashboard</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mockup Content */}
                            <div className="p-6 md:p-8 space-y-6">
                                {/* Progress Header */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-foreground">Weekly Progress</div>
                                        <div className="text-xs text-muted-foreground font-body">Jun 24 - Jun 30</div>
                                    </div>
                                    <div className="px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg">
                                        <span className="text-xs font-medium text-primary">+12%</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: "Classes", value: "4", color: "text-primary" },
                                        { label: "Hours", value: "6.5", color: "text-accent" },
                                        { label: "Avg", value: "88%", color: "text-emerald-500" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-background border border-border/60">
                                            <div className={`text-2xl font-heading ${stat.color} mb-1`}>{stat.value}</div>
                                            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chart Area */}
                                <div className="h-40 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-5 relative overflow-hidden">
                                    <div className="flex items-end justify-between h-full gap-2">
                                        {[45, 68, 52, 85, 72, 90, 78].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-primary/20 rounded-t-lg relative group overflow-hidden"
                                            >
                                                <div
                                                    className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-1000 ease-out rounded-t-lg"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                {/* Tooltip on hover */}
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                    <div className="px-2 py-1 bg-foreground text-background text-[10px] rounded font-medium whitespace-nowrap shadow-lg">
                                                        {h}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute top-1/4 left-0 right-0 h-px bg-border/30"></div>
                                        <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30"></div>
                                        <div className="absolute top-3/4 left-0 right-0 h-px bg-border/30"></div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-foreground mb-2">Recent Activity</div>
                                    {[
                                        { text: "Completed Math practice", time: "2h ago", icon: Target, iconColor: "text-primary" },
                                        { text: "New message from tutor", time: "4h ago", icon: Bell, iconColor: "text-amber-500" },
                                        { text: "Lesson preview available", time: "Yesterday", icon: Headphones, iconColor: "text-accent" }
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                            <div className={`size-8 rounded-full flex items-center justify-center ${activity.iconColor}/10 group-hover:scale-110 transition-transform`}>
                                                <activity.icon size={14} className={activity.iconColor} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground truncate">{activity.text}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Notification Badge */}
                            <div className="absolute top-4 right-4">
                                <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg shadow-primary/25 flex items-center gap-2">
                                    <div className="size-2 bg-white/30 rounded-full animate-pulse"></div>
                                    <span className="font-body">Live Updates</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative floating elements */}
                        <div className="absolute -top-6 -right-6 lg:-right-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                            <div className="bg-card p-4 rounded-2xl border border-border/60 shadow-premium-lg flex items-center gap-4">
                                <div className="size-10 bg-gradient-to-br from-accent to-amber-500 text-white rounded-xl flex items-center justify-center">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground font-body mb-0.5">New update</p>
                                    <p className="text-sm font-semibold text-foreground tracking-tight">Session completed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="order-1 lg:order-2 lg:col-span-5 space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
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

                </div>
            </div>
        </section>
    );
};

export default FeatureSpotlight;
