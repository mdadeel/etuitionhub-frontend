import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RouteErrorBoundary from '../RouteErrorBoundary';

// Component that throws on render
const ThrowingComponent = () => {
  throw new Error('Test error');
};

// Normal component
const NormalComponent = () => <div>Normal content</div>;

describe('RouteErrorBoundary', () => {
  it('renders children normally when no error', () => {
    render(
      <RouteErrorBoundary>
        <NormalComponent />
      </RouteErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches errors and shows error UI', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <RouteErrorBoundary>
        <ThrowingComponent />
      </RouteErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
