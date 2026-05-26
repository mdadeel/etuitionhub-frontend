import { Target, Bell, Headphones } from 'lucide-react';

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
        <section className="py-20 bg-card overflow-hidden relative border-b border-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Visual Mockup Area */}
                    <div className="relative order-2 lg:order-1 lg:col-span-7 opacity-0 animate-scale-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                        <div className="relative bg-card rounded border border-border shadow-premium overflow-hidden transition-all duration-700">
                            {/* Browser/Window Header */}
                            <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 rounded bg-muted-foreground/30"></div>
                                <div className="w-2.5 h-2.5 rounded bg-muted-foreground/30"></div>
                                <div className="w-2.5 h-2.5 rounded bg-muted-foreground/30"></div>
                                <div className="ml-4 h-4 bg-card border border-border rounded-sm w-48"></div>
                            </div>

                            {/* Mockup Content */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-3 bg-muted rounded w-32"></div>
                                        <div className="h-2 bg-background rounded w-48"></div>
                                    </div>
                                    <div className="w-10 h-10 bg-muted border border-border rounded"></div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-20 bg-background border border-border rounded p-3 space-y-2">
                                            <div className="h-1.5 bg-muted rounded w-3/4"></div>
                                            <div className="h-4 bg-muted rounded w-full"></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-40 bg-background border border-border rounded p-6 relative overflow-hidden">
                                    <div className="flex items-end justify-between h-full gap-1">
                                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                            <div 
                                                key={i} 
                                                className="w-full bg-primary/30 rounded-t transition-all duration-1000" 
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded"></div>
                                        <span className="text-xs font-medium text-muted-foreground font-body">Learning progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Notification - Minimal Sharp */}
                        <div className="absolute -top-6 -right-4 bg-card p-4 rounded border border-border/80 flex items-center gap-4 shadow-premium opacity-0 animate-scale-in" style={{ animationDelay: '500ms' }}>
                            <div className="w-8 h-8 bg-primary/10 text-primary border border-primary/20 rounded flex items-center justify-center">
                                <Bell size={16} />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-muted-foreground font-body mb-0.5">New message</p>
                                <p className="text-sm font-medium text-foreground tracking-tight">Tutor connected successfully</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="order-1 lg:order-2 lg:col-span-5 space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted border border-border rounded">
                                <span className="text-xs font-medium text-muted-foreground">Our Features</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-heading text-foreground tracking-tight leading-[1.05]">
                                Track Your <br />
                                <span className="text-primary font-semibold">Learning</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed font-body">
                                Take control of your educational journey with our comprehensive dashboard. Keep track of tutor interactions and lessons in one simple interface.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-5">
                                    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/20 text-primary rounded">
                                        <feature.icon size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-semibold text-foreground tracking-tight">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-body">
                                            {feature.description}
                                        </p>
                                    </div>
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