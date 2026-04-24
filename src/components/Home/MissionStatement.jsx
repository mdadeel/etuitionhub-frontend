import { AppleBadge } from '../shared/AppleUI';

const MissionStatement = () => {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            {/* Background Text Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-muted-foreground/[0.03] select-none pointer-events-none uppercase tracking-tighter">
                PURPOSE
            </div>

            <div className="container mx-auto px-6 max-w-[1400px] relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <AppleBadge variant="primary" className="mb-10 bg-primary/10 text-primary border-none mx-auto">THE MISSION</AppleBadge>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-tight text-foreground mb-12 uppercase mx-auto">
                        QUALITY EDUCATION <span className="text-primary italic">FOR EVERYONE.</span>
                    </h2>
                    <p className="text-xl md:text-3xl text-muted-foreground leading-snug font-medium max-w-3xl mx-auto">
                        Whether you're preparing for <span className="text-foreground">SSC, HSC, or O-Levels</span>—we connect you with educators who don't just teach, but inspire academic breakthroughs across Bangladesh.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;
