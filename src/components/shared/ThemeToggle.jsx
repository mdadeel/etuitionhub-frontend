import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`relative p-2 rounded-xl bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-all active:scale-95 group overflow-hidden ${className}`}
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
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default ThemeToggle;
