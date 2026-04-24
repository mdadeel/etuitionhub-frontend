import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const FilterSelect = ({ value, onValueChange, options, placeholder, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between bg-muted/40 border border-border/40 rounded-xl px-4 text-xs font-semibold transition-all duration-200",
          "hover:bg-muted/60 hover:border-border/60",
          "focus:outline-none focus:ring-2 focus:ring-primary/10",
          isOpen && "ring-2 ring-primary/10 bg-muted/60 border-primary/20"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon size={14} className="text-muted-foreground shrink-0" />}
          <span className={cn(
            "truncate",
            (!value || value === 'All') ? 'text-muted-foreground' : 'text-foreground'
          )}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={cn(
            "text-muted-foreground shrink-0 transition-transform duration-300 ease-out",
            isOpen && "rotate-180 text-primary"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute z-[110] mt-2 w-full bg-card/95 border border-border shadow-2xl rounded-2xl p-1.5 backdrop-blur-xl max-h-[280px] overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => {
              const val = typeof option === 'string' ? option : option.value;
              const labelText = typeof option === 'string' ? option : option.label;
              const isSelected = value === val;
              
              return (
                <li
                  key={val}
                  onClick={() => {
                    onValueChange(val);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "group relative flex w-full cursor-pointer items-center justify-between rounded-xl py-2.5 px-3 text-xs font-medium transition-all duration-150 select-none",
                    isSelected 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted/80 text-foreground active:scale-[0.98]"
                  )}
                >
                  <span className="truncate">{labelText}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </li>
              );
            })}
            {options.length === 0 && (
              <li className="py-8 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                No results
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSelect;
