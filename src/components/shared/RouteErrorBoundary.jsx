import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { PageSkeleton } from './skeletons';

/**
 * Wraps a lazy-loaded route with its own ErrorBoundary and Suspense.
 * Prevents one page crash from bringing down all routing.
 */
const RouteErrorBoundary = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageSkeleton />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default RouteErrorBoundary;
