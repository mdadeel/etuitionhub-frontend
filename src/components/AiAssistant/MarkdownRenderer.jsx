import { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import CodeBlock from './CodeBlock';
import { MathInline, MathBlock } from './MathRenderer';
import ImageRenderer from './ImageRenderer';

const sanitizeSchema = {
    tagNames: [
        'a', 'b', 'i', 'em', 'strong', 'code', 'pre', 'br', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'ul', 'ol', 'li', 'blockquote', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'details', 'summary', 'img', 'del', 'mark',
        'math-inline', 'math-block',
    ],
    attributes: {
        a: ['href', 'title', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'loading', 'width', 'height'],
        code: ['className'],
        td: ['colSpan', 'rowSpan', 'align'],
        th: ['colSpan', 'rowSpan', 'align'],
        '*': ['className'],
        'math-inline': ['data-math'],
        'math-block': ['data-math'],
    },
    protocols: {
        href: ['http', 'https', 'mailto'],
        src: ['http', 'https'],
    },
};

function preprocessMath(text) {
    if (!text) return text;

    let result = text;

    result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        return `<math-block data-math="${math.replace(/"/g, '&quot;')}"></math-block>`;
    });

    result = result.replace(/\$([^$\n]+?)\$/g, (_, math) => {
        return `<math-inline data-math="${math.replace(/"/g, '&quot;')}"></math-inline>`;
    });

    return result;
}

function MathInlineComponent({ ...props }) {
    const math = props['data-math'] || '';
    return <MathInline math={math} />;
}

function MathBlockComponent({ ...props }) {
    const math = props['data-math'] || '';
    return <MathBlock math={math} />;
}

function MarkdownPre({ children }) {
    // Fenced code blocks in react-markdown wrap the code element inside a pre.
    // We extract its props and render our CodeBlock component.
    const codeElement = Array.isArray(children) ? children[0] : children;
    if (codeElement && codeElement.props) {
        const { className, children: codeText } = codeElement.props;
        if (codeText !== undefined) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(codeText).replace(/\n$/, '');
            return <CodeBlock code={code} language={language} />;
        }
    }
    return <pre className="p-4 rounded-xl border border-border/40 bg-zinc-50 dark:bg-[#0d1117] overflow-x-auto">{children}</pre>;
}

function MarkdownCode({ children, ...props }) {
    // If it is inline code (no class prefix matching language-)
    return (
        <code
            className="px-1.5 py-0.5 mx-0.5 rounded bg-muted text-primary border border-border/40 font-mono text-[13px] font-semibold dark:bg-zinc-800 dark:text-zinc-100"
            {...props}
        >
            {children}
        </code>
    );
}

function MarkdownLink({ href, children, ...props }) {
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            {...props}
        >
            {children}
            {isExternal && (
                <span className="inline-block ml-0.5 text-[10px] align-super">↗</span>
            )}
        </a>
    );
}

function MarkdownTable({ children, ...props }) {
    return (
        <div className="overflow-x-auto my-4 rounded-lg border border-border">
            <table className="w-full text-sm border-collapse" {...props}>
                {children}
            </table>
        </div>
    );
}

function MarkdownThead({ children, ...props }) {
    return (
        <thead className="bg-muted/30 border-b-2 border-border sticky top-0 z-10" {...props}>
            {children}
        </thead>
    );
}

function MarkdownTh({ children, ...props }) {
    return (
        <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground border-r border-border last:border-r-0" {...props}>
            {children}
        </th>
    );
}

function MarkdownTd({ children, ...props }) {
    return (
        <td className="px-3 py-2.5 border-b border-border last:border-b-0 align-top" {...props}>
            {children}
        </td>
    );
}

function MarkdownBlockquote({ children, ...props }) {
    return (
        <blockquote className="border-l-4 border-primary/40 pl-4 py-2 my-3 bg-primary/5 rounded-r-lg italic text-muted-foreground" {...props}>
            {children}
        </blockquote>
    );
}

function MarkdownH1({ children, ...props }) {
    return <h1 className="text-2xl font-bold mt-6 mb-3 font-heading text-foreground border-l-2 border-primary/30 pl-3" {...props}>{children}</h1>;
}

function MarkdownH2({ children, ...props }) {
    return <h2 className="text-xl font-semibold mt-5 mb-2.5 font-heading text-foreground border-l-2 border-primary/30 pl-3" {...props}>{children}</h2>;
}

function MarkdownH3({ children, ...props }) {
    return <h3 className="text-lg font-semibold mt-4 mb-2 font-heading text-foreground border-l-2 border-primary/30 pl-3" {...props}>{children}</h3>;
}

function MarkdownH4({ children, ...props }) {
    return <h4 className="text-base font-semibold mt-3 mb-1.5 font-heading text-foreground" {...props}>{children}</h4>;
}

function MarkdownH5({ children, ...props }) {
    return <h5 className="text-sm font-semibold mt-2 mb-1 text-muted-foreground font-heading" {...props}>{children}</h5>;
}

function MarkdownH6({ children, ...props }) {
    return <h6 className="text-xs font-semibold mt-2 mb-1 text-muted-foreground font-heading uppercase tracking-wide" {...props}>{children}</h6>;
}

function MarkdownUl({ children, ...props }) {
    return <ul className="list-disc list-inside space-y-1 my-2 pl-2" {...props}>{children}</ul>;
}

function MarkdownOl({ children, ...props }) {
    return <ol className="list-decimal list-inside space-y-1 my-2 pl-2 marker:text-primary marker:font-semibold" {...props}>{children}</ol>;
}

function MarkdownLi({ children, ...props }) {
    return <li className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap" {...props}>{children}</li>;
}

function MarkdownHr(props) {
    return <hr className="border-t border-border my-6" {...props} />;
}

function MarkdownImg({ src, alt }) {
    return <ImageRenderer src={src} alt={alt} />;
}

function MarkdownDel({ children, ...props }) {
    return <del className="line-through text-muted-foreground" {...props}>{children}</del>;
}

function MarkdownMark({ children, ...props }) {
    return <mark className="bg-yellow-200/50 dark:bg-yellow-500/20 px-0.5 rounded" {...props}>{children}</mark>;
}

export default function MarkdownRenderer({ content, className = '' }) {
    const processed = useMemo(() => preprocessMath(content), [content]);

    if (!content) return null;

    return (
        <div className={className}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={{
                    pre: MarkdownPre,
                    code: MarkdownCode,
                    a: MarkdownLink,
                    table: MarkdownTable,
                    thead: MarkdownThead,
                    th: MarkdownTh,
                    td: MarkdownTd,
                    blockquote: MarkdownBlockquote,
                    h1: MarkdownH1,
                    h2: MarkdownH2,
                    h3: MarkdownH3,
                    h4: MarkdownH4,
                    h5: MarkdownH5,
                    h6: MarkdownH6,
                    ul: MarkdownUl,
                    ol: MarkdownOl,
                    li: MarkdownLi,
                    hr: MarkdownHr,
                    img: MarkdownImg,
                    del: MarkdownDel,
                    mark: MarkdownMark,
                    'math-inline': MathInlineComponent,
                    'math-block': MathBlockComponent,
                }}
            >
                {processed}
            </Markdown>
        </div>
    );
}
