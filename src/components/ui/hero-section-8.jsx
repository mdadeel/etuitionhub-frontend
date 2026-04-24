import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudyingIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full max-w-[300px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    
    <rect x="80" y="200" width="240" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="100" y="180" width="200" height="20" rx="4" fill="url(#deskGrad)" stroke="currentColor" strokeOpacity="0.2" />
    
    <rect x="120" y="120" width="80" height="60" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" />
    <rect x="130" y="130" width="60" height="40" rx="2" fill="currentColor" fillOpacity="0.05" />
    <line x1="140" y1="140" x2="180" y2="140" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
    <line x1="140" y1="150" x2="170" y2="150" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
    <line x1="140" y1="160" x2="175" y2="160" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />
    
    <circle cx="260" cy="100" r="35" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
    <path d="M245 100 L255 110 L275 90" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    
    <circle cx="320" cy="70" r="15" fill="var(--primary)" fillOpacity="0.15" />
    <circle cx="70" cy="80" r="12" fill="var(--primary)" fillOpacity="0.1" />
    <circle cx="350" cy="150" r="10" fill="var(--primary)" fillOpacity="0.08" />
    <circle cx="50" cy="140" r="8" fill="var(--primary)" fillOpacity="0.1" />
    
    <rect x="200" y="160" width="60" height="80" rx="8" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.12" />
    <circle cx="230" cy="185" r="12" fill="currentColor" fillOpacity="0.1" />
    <rect x="215" y="210" width="30" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="215" y="220" width="20" height="3" rx="1.5" fill="currentColor" fillOpacity="0.08" />
  </svg>
);

export const FormBuilderHero = ({
  illustrationSrc,
  illustrationAlt = "Hero Illustration",
  title,
  description,
  buttonText,
  buttonHref = "#",
  onButtonClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-8 md:py-12">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <StudyingIllustration />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-8 max-w-lg text-base md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div variants={itemVariants}>
          <Button asChild size="lg" onClick={onButtonClick}>
            <a href={buttonHref}>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
