import { useMemo, Component } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

function parseMathSegments(text) {
    if (!text) return [{ type: 'text', content: '' }];

    const segments = [];
    let remaining = text;

    while (remaining.length > 0) {
        const blockIdx = remaining.indexOf('$$');
        const inlineIdx = remaining.indexOf('$');

        if (blockIdx === -1 && inlineIdx === -1) {
            segments.push({ type: 'text', content: remaining });
            break;
        }

        let nextIdx = -1;
        let nextType = '';

        if (blockIdx !== -1 && (inlineIdx === -1 || blockIdx <= inlineIdx)) {
            nextIdx = blockIdx;
            nextType = 'block';
        } else if (inlineIdx !== -1) {
            nextIdx = inlineIdx;
            nextType = 'inline';
        }

        if (nextIdx === -1) {
            segments.push({ type: 'text', content: remaining });
            break;
        }

        if (nextIdx > 0) {
            segments.push({ type: 'text', content: remaining.slice(0, nextIdx) });
        }

        const delimiter = nextType === 'block' ? '$$' : '$';
        const endIdx = remaining.indexOf(delimiter, nextIdx + delimiter.length);

        if (endIdx === -1) {
            segments.push({ type: 'text', content: remaining.slice(nextIdx) });
            break;
        }

        const mathContent = remaining.slice(nextIdx + delimiter.length, endIdx);
        segments.push({
            type: nextType === 'block' ? 'blockMath' : 'inlineMath',
            content: mathContent,
        });

        remaining = remaining.slice(endIdx + delimiter.length);
    }

    return segments;
}

class MathErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export function MathBlock({ math }) {
    return (
        <MathErrorBoundary
            fallback={
                <code className="block my-4 p-4 bg-muted/50 rounded-lg text-sm text-destructive font-mono">
                    {math}
                </code>
            }
        >
            <BlockMath math={math} />
        </MathErrorBoundary>
    );
}

export function MathInline({ math }) {
    return (
        <MathErrorBoundary
            fallback={
                <code className="px-1.5 py-0.5 bg-muted/50 rounded text-sm text-destructive font-mono">
                    {math}
                </code>
            }
        >
            <InlineMath math={math} />
        </MathErrorBoundary>
    );
}

export default function MathRenderer({ text, className = '' }) {
    const segments = useMemo(() => parseMathSegments(text), [text]);

    if (segments.length === 1 && segments[0].type === 'text') {
        return <span className={className}>{text}</span>;
    }

    return (
        <span className={className}>
            {segments.map((seg, i) => {
                if (seg.type === 'text') return <span key={i}>{seg.content}</span>;
                if (seg.type === 'inlineMath') return <MathInline key={i} math={seg.content} />;
                if (seg.type === 'blockMath') return <div key={i} className="my-4 overflow-x-auto"><MathBlock math={seg.content} /></div>;
                return null;
            })}
        </span>
    );
}
