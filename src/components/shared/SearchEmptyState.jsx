import { SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const emptySuggestions = [];

const SearchEmptyState = ({ query, type = 'results', suggestions = emptySuggestions }) => {
    const navigate = useNavigate();
    const [spellingSuggestions, setSpellingSuggestions] = useState([]);
    const [prevQuery, setPrevQuery] = useState(null);

    // Sync state during render if query changes to avoid extra render cycle
    if (query !== prevQuery) {
        setPrevQuery(query);
        if (!query || query.length < 2) {
            setSpellingSuggestions([]);
        }
    }

    useEffect(() => {
        if (!query || query.length < 2) return;
        const controller = new AbortController();
        fetch(`${API_URL}/api/search/suggestions?q=${encodeURIComponent(query)}`, {
            signal: controller.signal,
        })
            .then(r => r.json())
            .then(data => setSpellingSuggestions(data.suggestions || []))
            .catch(() => setSpellingSuggestions([]));
        return () => controller.abort();
    }, [query]);

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="size-16 bg-background rounded-full flex items-center justify-center mb-4">
                <SearchX size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                No {type} found
            </h3>
            {query && (
                <p className="text-sm text-muted-foreground mb-4">
                    No results for "<span className="font-semibold">{query}</span>"
                </p>
            )}
            {!query && (
                <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filters or search term
                </p>
            )}
            {suggestions.length > 0 && (
                <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">
                        Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => navigate(`/${type === 'tuitions' ? 'tuitions' : 'tutors'}?q=${encodeURIComponent(s)}`)}
                                className="px-3 py-1.5 min-h-[36px] inline-flex items-center text-xs rounded-lg bg-background text-foreground border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {spellingSuggestions.length > 0 && (
                <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">
                        Did you mean?
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {spellingSuggestions.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => navigate(`/tutors?q=${encodeURIComponent(s)}`)}
                                className="px-3 py-1.5 min-h-[36px] inline-flex items-center text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {suggestions.length === 0 && spellingSuggestions.length === 0 && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/${type === 'tuitions' ? 'tuitions' : 'tutors'}`)}
                        className="inline-flex items-center justify-center px-4 py-2 min-h-[36px] text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Browse all {type}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchEmptyState;
