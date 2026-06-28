import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ImageRenderer({ src, alt, className = '' }) {
    const [status, setStatus] = useState('loading');
    const [zoomed, setZoomed] = useState(false);

    if (!src) return null;

    return (
        <>
            <figure className={cn('my-3', className)}>
                {status === 'error' ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-sm">
                        <span>Image failed to load</span>
                        <button
                            type="button"
                            onClick={() => { setStatus('loading'); }}
                            className="text-xs underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="relative group cursor-zoom-in" onClick={() => setZoomed(true)}>
                        {status === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg animate-pulse">
                                <span className="text-xs text-muted-foreground">Loading...</span>
                            </div>
                        )}
                        <img
                            src={src}
                            alt={alt || ''}
                            loading="lazy"
                            onLoad={() => setStatus('loaded')}
                            onError={() => setStatus('error')}
                            className={cn(
                                'max-w-full h-auto rounded-lg transition-opacity duration-300',
                                status === 'loaded' ? 'opacity-100' : 'opacity-0',
                            )}
                        />
                    </div>
                )}
                {alt && (
                    <figcaption className="mt-2 text-xs text-muted-foreground text-center italic">
                        {alt}
                    </figcaption>
                )}
            </figure>

            {zoomed && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setZoomed(false)}
                    role="dialog"
                    aria-label="Image preview"
                >
                    <img
                        src={src}
                        alt={alt || ''}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    />
                    <button
                        type="button"
                        onClick={() => setZoomed(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-sm font-semibold"
                        aria-label="Close image preview"
                    >
                        Close
                    </button>
                </div>
            )}
        </>
    );
}
