import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { PageSkeleton } from './skeletons';

/**
 * Wraps a lazy-loaded route with its own ErrorBoundary and Suspense.
 * Prevents one page crash from bringing down all routing.
 * Resets on pathname/search change so a transient error (e.g. stale chunk
 * after deploy) doesn't stay stuck until hard refresh.
 */
const RouteErrorBoundary = ({ children }) => {
  const { pathname, search } = useLocation();
  const key = pathname + search;
  return (
    <ErrorBoundary resetKey={key} key={key}>
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;
