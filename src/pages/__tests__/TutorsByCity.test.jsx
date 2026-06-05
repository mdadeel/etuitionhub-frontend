import { describe, it, expect } from 'vitest';

const formatCity = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

describe('formatCity', () => {
  it('converts hyphens to spaces and capitalises', () => {
    expect(formatCity('dhaka')).toBe('Dhaka');
    expect(formatCity('chattogram')).toBe('Chattogram');
    expect(formatCity('mirpur-10')).toBe('Mirpur 10');
    expect(formatCity('narayanganj')).toBe('Narayanganj');
  });
});
