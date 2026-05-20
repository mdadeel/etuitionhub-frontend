import { SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const SearchEmptyState = ({ query, type = 'results', suggestions = [] }) => {
    const navigate = useNavigate();
    const [spellingSuggestions, setSpellingSuggestions] = useState([]);

    useEffect(() => {
        if (!query || query.length < 2) {
            setSpellingSuggestions([]);
            return;
        }
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
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mb-4">
                <SearchX size={28} className="text-[#94A3B8]" />
            </div>
            <h3 className="font-heading font-black text-lg text-[#111827] mb-1">
                No {type} found
            </h3>
            {query && (
                <p className="text-sm text-[#5B6475] mb-4">
                    No results for "<span className="font-semibold">{query}</span>"
                </p>
            )}
            {!query && (
                <p className="text-sm text-[#5B6475] mb-4">
                    Try adjusting your filters or search term
                </p>
            )}
            {suggestions.length > 0 && (
                <div className="text-center">
                    <p className="text-xs text-[#94A3B8] mb-2 font-heading font-bold uppercase tracking-wider">
                        Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((s, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 text-xs bg-[#F5F7FA] text-[#5B6475] border border-[rgba(15,23,46,0.08)]"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {spellingSuggestions.length > 0 && (
                <div className="text-center mt-4">
                    <p className="text-xs text-[#94A3B8] mb-2 font-heading font-bold uppercase tracking-wider">
                        Did you mean?
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {spellingSuggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(`/tutors?q=${encodeURIComponent(s)}`)}
                                className="px-3 py-1.5 text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/20 rounded-lg transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchEmptyState;
