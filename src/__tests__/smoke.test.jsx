import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('smoke', () => {
  it('Vitest is wired up', () => {
    render(<div data-testid="hello">Hello</div>);
    expect(screen.getByTestId('hello')).toBeInTheDocument();
  });
});
