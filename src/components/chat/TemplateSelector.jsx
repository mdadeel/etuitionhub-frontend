import React, { useState, useEffect } from 'react';
import { Search, SendHorizontal, X, Loader2, Check, Menu, Calendar, CircleHelp } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TemplateSelector = ({ 
    onClose, 
    onSelect 
}) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('my'); // my, public
    const [filterCategory, setFilterCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab, searchQuery, filterCategory]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            let res;
            
            if (selectedTab === 'my') {
                res = await api.get(`/api/templates`);
            } else {
                res = await api.get(`/api/templates/public`);
            }
            
            setTemplates(res.data);
            
            // Extract unique categories
            const uniqueCategories = [...new Set(res.data.map(t => t.category).filter(Boolean))];
            setCategories(['all', ...uniqueCategories.sort()]);
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError('Failed to load templates');
            toast.error('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = async (template) => {
        onSelect(template);
        onClose();
    };

    const handleCreateTemplate = () => {
        // In a real implementation, this would open a template creation modal
        toast.info('Template creation feature coming soon');
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTemplates = templates.filter(template => {
        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            const matchesTitle = template.title.toLowerCase().includes(query);
            const matchesContent = template.content.toLowerCase().includes(query);
            if (!matchesTitle && !matchesContent) return false;
        }
        
        // Category filter
        if (filterCategory !== 'all' && template.category !== filterCategory) {
            return false;
        }
        
        return true;
    });

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="text-center py-4">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground">Loading templates...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-primary">
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-bold text-foreground">Templates</h3>
                        </div>
                        <div className="text-center py-6">
                            <CircleHelp size={36} className="text-destructive" />
                            <p className="text-muted-foreground">{error?.message || error}</p>
                            <button 
                                onClick={onClose} 
                                className="mt-4 w-full px-4 py-2 bg-destructive text-destructive/foreground hover:bg-destructive/20 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground">
                                {selectedTab === 'my' ? 'My Templates' : 'Public Templates'}
                            </h3>
                            {selectedTab === 'my' && (
                                <button
                                    onClick={handleCreateTemplate}
                                    className="px-3 py-1 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                                >
                                    New Template
                                </button>
                            )}
                        </div>
                        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-primary">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Controls */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* Tab Selector */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-muted-foreground">View:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedTab('my')}
                                        className={cn(
                                            "px-3 py-1 text-sm font-medium rounded-lg",
                                            selectedTab === 'my' && "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        My Templates
                                    </button>
                                    <button
                                        onClick={() => setSelectedTab('public')}
                                        className={cn(
                                            "px-3 py-1 text-sm font-medium rounded-lg",
                                            selectedTab === 'public' && "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        Public Templates
                                    </button>
                                </div>
                            </div>
                            
                            {/* Search */}
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-[50%] -translate-y-[50%] text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="pl-8 pr-3 py-2 bg-muted border border-border/200 rounded-lg focus:outline-none focus:border-primary/20 text-sm"
                                />
                            </div>
                            
                            {/* Category Filter */}
                            <div className="relative">
                                <Menu size={18} className="absolute left-3 top-[50%] -translate-y-[50%] text-muted-foreground" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="pl-8 pr-3 py-2 bg-muted border border-border/200 rounded-lg focus:outline-none focus:border-primary/20 text-sm"
                                >
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {/* Templates List */}
                    <div className="space-y-3">
                        {filteredTemplates.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                {selectedTab === 'my' 
                                    ? 'You haven\'t created any templates yet. Create one to get started!' 
                                    : 'No public templates match your search criteria.'}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredTemplates.map((template, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/100 transition-colors cursor-pointer"
                                        onClick={() => handleSelectTemplate(template)}
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">{template.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {template.category ? `#${template.category}` : 'General'}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {template.content.substring(0, 100)}{template.content.length > 100 ? '...' : ''}
                                            </p>
                                        </div>
                                        <div className="text-right space-x-2">
                                            <span className="text-xs text-muted-foreground">
                                                {template.isPublic ? (
                                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                                        Public
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full">
                                                        Private
                                                    </span>
                                                )}
                                            </span>
                                            <Check size={16} className="text-primary/50" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelector;
