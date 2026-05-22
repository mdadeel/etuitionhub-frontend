import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const FilterSelect = ({
    value,
    onValueChange,
    options = [],
    placeholder = 'Select...',
    label,
    icon: Icon,
    multi = false,
    searchable = false,
    async: isAsync = false,
    loadOptions,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [asyncOptions, setAsyncOptions] = useState([]);
    const [loadingAsync, setLoadingAsync] = useState(false);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

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
        if (isOpen && searchable && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
        if (!isOpen) setSearchQuery('');
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
        <div className="relative" ref={containerRef}>
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
                    'hover:border-[#2563EB]/30 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20',
                    hasValue ? 'text-foreground' : 'text-muted-foreground'
                )}
            >
                <div className="flex items-center gap-2 min-w-0">
                    {Icon && <Icon size={14} className="shrink-0 opacity-55" />}
                    {multi && selectedValues.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                            {selectedValues.slice(0, 3).map(v => (
                                <span key={v} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-background text-[10px] font-medium text-muted-foreground border border-border rounded">
                                    {getOptionLabel(v)}
                                    <X
                                        size={10}
                                        className="cursor-pointer hover:text-red-500"
                                        onClick={(e) => handleRemoveChip(e, v)}
                                    />
                                </span>
                            ))}
                            {selectedValues.length > 3 && (
                                <span className="text-[10px] text-[#94A3B8]">
                                    +{selectedValues.length - 3}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="truncate">{displayText}</span>
                    )}
                </div>
                <ChevronDown size={14} className={cn('shrink-0 transition-transform', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-card border border-border shadow-lg rounded-xl overflow-hidden">
                    {searchable && (
                        <div className="p-2 border-b border-border">
                            <div className="relative">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-7 pr-3 h-8 text-xs bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-[#2563EB]/20 text-foreground"
                                />
                            </div>
                        </div>
                    )}
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {loadingAsync ? (
                            <li className="px-3 py-2 text-xs text-muted-foreground text-center">Loading...</li>
                        ) : displayOptions.length === 0 ? (
                            <li className="px-3 py-2 text-xs text-muted-foreground text-center">No results</li>
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
                                            'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors',
                                            selected ? 'bg-[#2563EB]/10 text-[#2563EB] font-medium' : 'text-muted-foreground hover:bg-background'
                                        )}
                                    >
                                        <span>{optLabel}</span>
                                        {multi ? (
                                            <div className={cn(
                                                'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                                                selected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB]'
                                            )}>
                                                {selected && <Check size={10} className="text-white" />}
                                            </div>
                                        ) : selected ? (
                                            <Check size={14} className="text-[#2563EB]" />
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
