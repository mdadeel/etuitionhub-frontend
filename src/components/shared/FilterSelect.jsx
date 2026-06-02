import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const emptyOptions = [];

const FilterSelect = ({
    value,
    onValueChange,
    options = emptyOptions,
    placeholder = 'Select...',
    label,
    icon: Icon,
    multi = false,
    searchable = false,
    async: isAsync = false,
    loadOptions,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpward, setIsUpUpward] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [asyncOptions, setAsyncOptions] = useState([]);
    const [loadingAsync, setLoadingAsync] = useState(false);
    const [prevIsOpen, setPrevIsOpen] = useState(null);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Sync state during render if isOpen changes to avoid extra render cycle
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (!isOpen) {
            setSearchQuery('');
        }
    }

    // Dynamic positioning logic
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            // If less than 250px below and more space above, open upwards
            if (spaceBelow < 250 && spaceAbove > spaceBelow) {
                setIsUpUpward(true);
            } else {
                setIsUpUpward(false);
            }
        }
    }, [isOpen]);

    const displayOptions = useMemo(() => {
        const source = isAsync ? asyncOptions : options;
        if (!searchable || isAsync || !searchQuery) return source;
        const q = searchQuery.toLowerCase();
        return source.filter(opt => {
            const label = typeof opt === 'object' ? opt.label : opt;
            return label.toLowerCase().includes(q);
        });
    }, [isAsync, asyncOptions, options, searchable, searchQuery]);
    const selectedValues = useMemo(
        () => (multi ? (Array.isArray(value) ? value : []) : [value].filter(Boolean)),
        [multi, value]
    );

    // Async loading
    useEffect(() => {
        if (!isOpen || !isAsync || !loadOptions) return;
        const timer = setTimeout(async () => {
            if (!searchQuery && options.length > 0) {
                setAsyncOptions(options);
                return;
            }
            setLoadingAsync(true);
            try {
                const results = await loadOptions(searchQuery);
                setAsyncOptions(results || []);
            } catch {
                setAsyncOptions([]);
            } finally {
                setLoadingAsync(false);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [searchQuery, isOpen, isAsync, loadOptions, options]);

    // Focus search input when dropdown opens
    useEffect(() => {
        let timer;
        if (isOpen && searchable && searchInputRef.current) {
            timer = setTimeout(() => searchInputRef.current?.focus(), 50);
        }
        return () => clearTimeout(timer);
    }, [isOpen, searchable]);

    // Click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isSelected = useCallback((optValue) => {
        if (multi) return selectedValues.includes(optValue);
        return String(value) === String(optValue);
    }, [multi, selectedValues, value]);

    const handleSelect = useCallback((optValue) => {
        if (multi) {
            const newVal = selectedValues.includes(optValue)
                ? selectedValues.filter(v => v !== optValue)
                : [...selectedValues, optValue];
            onValueChange(newVal);
        } else {
            onValueChange(optValue);
            setIsOpen(false);
        }
    }, [multi, selectedValues, onValueChange]);

    const handleRemoveChip = useCallback((e, chipValue) => {
        e.stopPropagation();
        const newVal = selectedValues.filter(v => v !== chipValue);
        onValueChange(newVal);
    }, [selectedValues, onValueChange]);

    // Compute display text
    const getOptionLabel = (optVal) => {
        const allOpts = isAsync ? [...asyncOptions, ...options] : options;
        const match = allOpts.find(o => (typeof o === 'object' ? o.value : o) === optVal);
        if (!match) return optVal;
        return typeof match === 'object' ? match.label : match;
    };

    const displayText = multi
        ? selectedValues.length === 0
            ? placeholder
            : `${selectedValues.length} selected`
        : selectedValues.length > 0
            ? getOptionLabel(selectedValues[0])
            : placeholder;

    const hasValue = multi ? selectedValues.length > 0 : selectedValues.length > 0;

    return (
        <div className={cn("relative", isOpen && "z-[100]")} ref={containerRef}>
            {label && (
                <label className="block text-xs font-heading font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'w-full flex items-center justify-between gap-2 h-10 px-3 bg-card border border-border rounded-xl text-sm transition-all',
                        'hover:border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/10',
                        hasValue ? 'text-foreground font-bold' : 'text-muted-foreground'
                    )}
                >
                <div className="flex items-center gap-2 min-w-0">
                    {Icon && <Icon size={14} className={cn("shrink-0 opacity-55", hasValue && "text-emerald-500 opacity-100")} />}
                    {multi && selectedValues.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                            {selectedValues.slice(0, 3).map(v => (
                                <span key={v} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100 rounded">
                                    {getOptionLabel(v)}
                                    <X
                                        size={10}
                                        className="cursor-pointer hover:text-red-500"
                                        onClick={(e) => handleRemoveChip(e, v)}
                                    />
                                </span>
                            ))}
                            {selectedValues.length > 3 && (
                                <span className="text-[10px] text-slate-400 font-bold">
                                    +{selectedValues.length - 3}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="truncate">{displayText}</span>
                    )}
                </div>
                <ChevronDown size={14} className={cn('shrink-0 transition-transform opacity-40', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute left-0 z-[101] w-full min-w-[200px] bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100",
                    isUpward ? "bottom-full mb-1 origin-bottom" : "top-full mt-1 origin-top"
                )}>
                    {searchable && (
                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-7 pr-3 h-8 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/30 text-slate-700"
                                />
                            </div>
                        </div>
                    )}
                    <ul className="max-h-60 overflow-y-auto py-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                        {loadingAsync ? (
                            <li className="px-3 py-4 text-xs text-muted-foreground text-center">
                                <div className="size-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                                Loading...
                            </li>
                        ) : displayOptions.length === 0 ? (
                            <li className="px-3 py-4 text-xs text-muted-foreground text-center">No results found</li>
                        ) : (
                            displayOptions.map((opt, idx) => {
                                const optValue = typeof opt === 'object' ? opt.value : opt;
                                const optLabel = typeof opt === 'object' ? opt.label : opt;
                                const selected = isSelected(optValue);
                                return (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelect(optValue)}
                                        className={cn(
                                            'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-all mx-1.5 rounded-lg mb-0.5 last:mb-0',
                                            selected 
                                                ? 'bg-emerald-50 text-emerald-700 font-bold' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                                        )}
                                    >
                                        <span className="truncate">{optLabel}</span>
                                        {multi ? (
                                            <div className={cn(
                                                'size-4 rounded border flex items-center justify-center transition-colors',
                                                selected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'
                                            )}>
                                                {selected && <Check size={10} className="text-white" />}
                                            </div>
                                        ) : selected ? (
                                            <Check size={14} className="text-emerald-600" />
                                        ) : null}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FilterSelect;
