import { memo, useState, useMemo } from 'react';
import { Copy, Check, ExternalLink, WrapText, ChevronDown, ChevronUp } from 'lucide-react';
import SyntaxHighlighter from './SyntaxHighlighter';

function isHtmlCode(code) {
    if (!code || typeof code !== 'string') return false;
    const clean = code.trim().toLowerCase();
    return (
        clean.startsWith('<!doctype html') ||
        clean.includes('<html') ||
        (clean.includes('<body') && clean.includes('</body>')) ||
        (clean.includes('<table') && clean.includes('</table>')) ||
        (clean.includes('<div') && clean.includes('</div>'))
    );
}

const COLLAPSE_THRESHOLD = 200;
const LINE_NUM_THRESHOLD = 20;
const COLLAPSED_LINES = 30;

export default memo(function CodeBlock({ code, language, isStreaming = false, showCursor = false }) {
    const [copied, setCopied] = useState(false);
    const [wrap, setWrap] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const lineCount = useMemo(() => code ? code.split('\n').length : 0, [code]);
    const shouldCollapse = lineCount > COLLAPSE_THRESHOLD && !expanded;
    const shouldShowLineNumbers = lineCount >= LINE_NUM_THRESHOLD;
    const displayCode = useMemo(() => {
        if (!code) return '';
        return shouldCollapse
            ? code.split('\n').slice(0, COLLAPSED_LINES).join('\n')
            : code;
    }, [code, shouldCollapse]);

    const lineNumbers = useMemo(() => {
        if (!shouldShowLineNumbers) return null;
        const count = shouldCollapse ? COLLAPSED_LINES : lineCount;
        return Array.from({ length: count }, (_, i) => i + 1);
    }, [shouldShowLineNumbers, shouldCollapse, lineCount]);

    if (!code) return null;

    const handleCopy = () => {
        navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
    };

    const handlePreview = () => {
        try {
            const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            const previewWindow = window.open(blobUrl, '_blank');
            if (!previewWindow) {
                alert('Popup blocker prevented opening the preview in a new tab. Please allow popups for this site.');
                return;
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (err) {
            console.error('Failed to open preview:', err);
        }
    };

    const isHtml = isHtmlCode(code) || (language && language.toLowerCase() === 'html');
    const displayLang = language ? language.toUpperCase() : 'CODE';

    return (
        <div className="flex flex-col mt-4 mb-6 rounded-xl overflow-hidden border border-border/40 bg-zinc-50 dark:bg-[#0d1117] shadow-md shadow-black/5 transition-colors duration-300">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100/80 dark:bg-zinc-950/30 border-b border-border/20 sticky top-0 z-10">
                <span className="text-[11px] font-bold text-zinc-500 select-none tracking-wider">
                    {displayLang}
                    {lineCount > 1 && (
                        <span className="ml-2 font-normal text-zinc-400">{lineCount} lines</span>
                    )}
                </span>
                <div className="flex items-center gap-2">
                    {lineCount >= LINE_NUM_THRESHOLD && (
                        <button
                            type="button"
                            onClick={() => setWrap(!wrap)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 active:scale-95 transition-all duration-150 px-1.5 py-0.5 rounded"
                            title={wrap ? 'Disable word wrap' : 'Enable word wrap'}
                            aria-label={wrap ? 'Disable word wrap' : 'Enable word wrap'}
                        >
                            <WrapText size={12} />
                        </button>
                    )}
                    {isHtml && (
                        <button
                            type="button"
                            onClick={handlePreview}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400/85 hover:text-orange-500 dark:text-orange-400/80 dark:hover:text-orange-400 active:scale-95 transition-all duration-150"
                            aria-label="Preview HTML in new tab"
                        >
                            <ExternalLink size={12} />
                            Preview
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={copied}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 active:scale-95 transition-all duration-150 disabled:opacity-100 disabled:text-emerald-500"
                        aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
                    >
                        {copied ? (
                            <>
                                <Check size={12} />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={12} />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="w-full relative">
                {isStreaming ? (
                    <pre className="p-4 text-[13px] font-mono leading-relaxed overflow-x-auto whitespace-pre text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-[#0d1117]">
                        <code>
                            {code}
                            {showCursor && (
                                <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-cursor-blink align-text-bottom" />
                            )}
                        </code>
                    </pre>
                ) : shouldShowLineNumbers ? (
                    <div className="flex overflow-x-auto">
                        <div className="flex-shrink-0 py-4 pl-4 pr-2 text-right select-none border-r border-border/30 bg-zinc-100/50 dark:bg-zinc-900/20">
                            {lineNumbers.map((num) => (
                                <div key={num} className="text-[12px] font-mono leading-relaxed text-zinc-400/60 dark:text-zinc-500/40">
                                    {num}
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 min-w-0">
                            <SyntaxHighlighter
                                code={displayCode}
                                language={language}
                                wrap={wrap}
                            />
                        </div>
                    </div>
                ) : (
                    <SyntaxHighlighter
                        code={displayCode}
                        language={language}
                        wrap={wrap}
                    />
                )}
            </div>

            {/* Collapse indicator */}
            {shouldCollapse && (
                <div className="relative">
                    <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-zinc-50 dark:from-[#0d1117] to-transparent pointer-events-none" />
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-[#0d1117] border-t border-border/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all duration-200"
                        aria-label={`Show all ${lineCount} lines`}
                    >
                        <ChevronDown size={14} />
                        Show all {lineCount} lines
                    </button>
                </div>
            )}
            {expanded && lineCount > COLLAPSE_THRESHOLD && (
                <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-[#0d1117] border-t border-border/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all duration-200"
                    aria-label="Collapse code block"
                >
                    <ChevronUp size={14} />
                    Collapse
                </button>
            )}
        </div>
    );
});
