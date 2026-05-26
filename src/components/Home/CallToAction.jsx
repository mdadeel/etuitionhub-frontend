import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-20 bg-card relative overflow-hidden border-b border-border">
            <div className="max-w-7xl mx-auto px-6 relative z-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-background border border-border/80 rounded p-12 md:p-16 text-center space-y-10 shadow-premium">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading text-foreground tracking-tight leading-tight">
                            Ready to get <span className="text-primary">started?</span>
                        </h2>
                        <p className="text-muted-foreground text-base max-w-xl mx-auto font-body">
                            Find the right tutor and start learning today.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-10 h-12 bg-primary text-primary-foreground font-semibold text-sm rounded hover:bg-primary/90 transition-all flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/tutors"
                            className="w-full sm:w-auto px-10 h-12 bg-transparent text-foreground border border-border hover:bg-muted font-semibold text-sm rounded transition-all flex items-center justify-center"
                        >
                            Browse Tutors
                        </Link>
                    </div>

                    <div className="pt-10 border-t border-border flex flex-wrap justify-center gap-8 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Instant Matching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Verified Tutors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Direct Contact</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;