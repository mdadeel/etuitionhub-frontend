import { AppleBadge } from '../shared/AppleUI';

const MissionStatement = () => {
    return (
        <section className="py-24 md:py-32 bg-background">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
                    <div className="w-full md:w-1/3">
                        <AppleBadge variant="primary" className="mb-4">Our Mission</AppleBadge>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                            Quality education for every student in Bangladesh.
                        </h2>
                    </div>
                    <div className="w-full md:w-2/3">
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Whether you're preparing for PSC, JSC, SSC, or HSC exams—we connect you with the right tutor who understands your board, your curriculum, and your goals.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionStatement;
