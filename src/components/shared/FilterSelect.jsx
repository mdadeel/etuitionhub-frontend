import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const FilterSelect = ({ value, onValueChange, options, placeholder, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

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
                <label className="text-sm font-medium text-slate-600 mb-2 block">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-10 w-full items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 text-sm transition-all",
                    "hover:bg-slate-100 hover:border-slate-300",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300",
                    isOpen && "ring-2 ring-blue-500/20 border-blue-300 bg-white"
                )}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && <Icon size={14} className="text-slate-400 shrink-0" />}
                    <span className={cn(
                        "truncate",
                        (!value || value === 'All') ? 'text-slate-400' : 'text-slate-900'
                    )}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown
                    size={14}
                    className={cn(
                        "text-slate-400 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-blue-600"
                    )}
                />
            </button>

            {isOpen && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                                    "flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors",
                                    isSelected
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <span className="truncate">{labelText}</span>
                                {isSelected && <Check size={14} />}
                            </li>
                        );
                    })}
                    {options.length === 0 && (
                        <li className="py-4 text-center text-sm text-slate-500">
                            No results
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default FilterSelect;