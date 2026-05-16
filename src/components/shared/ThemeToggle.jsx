import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ className }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 group overflow-hidden ${className}`}
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                    <motion.div
                        key="sun"
                        initial={{ y: 20, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2, ease: "anticipate" }}
                    >
                        <Sun size={20} strokeWidth={2.5} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ y: 20, opacity: 0, rotate: 45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.2, ease: "anticipate" }}
                    >
                        <Moon size={20} strokeWidth={2.5} />
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default ThemeToggle;
