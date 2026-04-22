import { useNavigate } from 'react-router-dom';
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import { ShieldCheck } from "lucide-react";

const HomeBanner = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background relative overflow-hidden pt-0">
            {/* Subtle Apple Glow Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -mr-64 -mt-64 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none"></div>

            <ShuffleHero 
                badge={
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-primary" />
                        <span>Verified Expert Network</span>
                    </div>
                }
                title={
                    <>
                        Precision learning. <br />
                        <span className="text-primary">Specialized results.</span>
                    </>
                }
                description="Connect with the most qualified academic professionals across the nation. A high-fidelity platform for students who demand excellence."
                buttonText="Find a Specialist"
                onButtonClick={() => navigate('/tutors')}
            />

            {/* Stats section moved below the hero for better balance */}
            <div className="container mx-auto px-8 pb-20">
                <div className="flex flex-wrap gap-12 md:gap-20 pt-12 border-t border-border/50 max-w-7xl mx-auto">
                    <div data-aos="fade-up" data-aos-delay="100">
                        <p className="text-4xl font-bold text-foreground tracking-tight">1,200+</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Verified Nodes</p>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="200">
                        <p className="text-4xl font-bold text-foreground tracking-tight">850+</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Active Streams</p>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="300">
                        <p className="text-4xl font-bold text-primary tracking-tight">4.9/5</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Satisfaction Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeBanner;

