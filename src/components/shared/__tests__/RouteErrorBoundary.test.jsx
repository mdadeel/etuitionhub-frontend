import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
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
      <MemoryRouter>
        <RouteErrorBoundary>
          <NormalComponent />
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches errors and shows error UI', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <MemoryRouter>
        <RouteErrorBoundary>
          <ThrowingComponent />
        </RouteErrorBoundary>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
