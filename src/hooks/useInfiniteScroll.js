import { useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (callback, { enabled = true, threshold = 200 } = {}) => {
    const sentinelRef = useRef(null);
    // eslint-disable-next-line react-hooks/use-memo
    const stableCallback = useCallback(callback, [callback]);

    useEffect(() => {
        if (!enabled || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    stableCallback();
                }
            },
            { rootMargin: `${threshold}px` }
        );

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [enabled, threshold, stableCallback]);

    return sentinelRef;
};

export default useInfiniteScroll;
