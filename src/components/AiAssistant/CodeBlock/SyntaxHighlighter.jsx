import { memo, useEffect, useState } from 'react';
import { createHighlighter } from 'shiki';

// Global singleton so we don't recreate the highlighter multiple times
let highlighterPromise = null;

export default memo(function SyntaxHighlighter({ code, language, wrap = true }) {
    const [html, setHtml] = useState(null);

    useEffect(() => {
        if (!code) return;

        let isMounted = true;
        const normalizedLang = (language || 'text').toLowerCase();

        // Map common aliases
        const langMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'jsx': 'jsx',
            'tsx': 'tsx',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'py': 'python',
            'sh': 'bash',
            'bash': 'bash',
            'sql': 'sql'
        };
        const langToUse = langMap[normalizedLang] || normalizedLang;

        async function highlight() {
            try {
                if (!highlighterPromise) {
                    highlighterPromise = createHighlighter({
                        themes: ['github-dark', 'github-light'],
                        langs: ['javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'python', 'bash', 'sql', 'markdown']
                    });
                }
                const highlighter = await highlighterPromise;
                
                // Load language dynamically if not already loaded, but we fallback to text if it fails
                const loadedLangs = highlighter.getLoadedLanguages();
                if (!loadedLangs.includes(langToUse)) {
                    await highlighter.loadLanguage(langToUse).catch(() => {});
                }
                
                const finalLang = highlighter.getLoadedLanguages().includes(langToUse) ? langToUse : 'text';

                const output = highlighter.codeToHtml(code, {
                    lang: finalLang,
                    themes: {
                        light: 'github-light',
                        dark: 'github-dark',
                    }
                });

                if (isMounted) {
                    setHtml(output);
                }
            } catch (err) {
                console.error('Shiki highlighting failed:', err);
                if (isMounted) {
                    setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
                }
            }
        }

        highlight();

        return () => {
            isMounted = false;
        };
    }, [code, language]);

    if (!html) {
        return (
            <pre className={`p-4 text-[13px] font-mono leading-relaxed ${wrap ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto whitespace-pre'} text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-[#0d1117]`}>
                <code>{code}</code>
            </pre>
        );
    }

    return (
        <div
            className={`${wrap ? 'shiki-container-wrap' : 'shiki-container'} text-[13px] font-mono leading-relaxed ${wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
