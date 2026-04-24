import { useNavigate } from 'react-router-dom';
import { FormBuilderHero } from "@/components/ui/hero-section-8";
import { motion } from "framer-motion";

const HomeBanner = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98], // Apple-like ease
            },
        },
    };

    return (
        <div className="relative overflow-hidden -mt-2">
            <motion.div 
                className="relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <FormBuilderHero 
                        illustrationSrc="https://illustrations.popsy.co/amber/studying.svg"
                        illustrationAlt="Student studying illustration"
                        title={
                            <>
                                Precision learning. <br />
                                <span className="text-primary">Specialized results.</span>
                            </>
                        }
                        description="Connect with qualified tutors across Bangladesh. Find perfect matches for SSC, HSC, and all education boards."
                        buttonText="Find a Tutor"
                        buttonHref="javascript:void(0)"
                        onButtonClick={(e) => {
                            e.preventDefault();
                            navigate('/tutors');
                        }}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HomeBanner;

