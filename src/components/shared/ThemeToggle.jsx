import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`relative p-2 rounded-xl bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 group overflow-hidden ${className}`}
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <div key="sun">
                    <Sun size={20} strokeWidth={2.5} />
                </div>
            ) : (
                <div key="moon">
                    <Moon size={20} strokeWidth={2.5} />
                </div>
            )}
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default ThemeToggle;
