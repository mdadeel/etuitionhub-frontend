import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CurriculumFilter from '../CurriculumFilter';

describe('CurriculumFilter', () => {
  it('renders All pill plus all 8 curriculum options', () => {
    render(<CurriculumFilter value={null} onChange={() => {}} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText(/NCTB \(Class 1/)).toBeInTheDocument();
    expect(screen.getByText('SSC Prep')).toBeInTheDocument();
    expect(screen.getByText('HSC Prep')).toBeInTheDocument();
    expect(screen.getByText('O-Level')).toBeInTheDocument();
    expect(screen.getByText('A-Level')).toBeInTheDocument();
    expect(screen.getByText('IELTS / TOEFL')).toBeInTheDocument();
    expect(screen.getByText(/Admission/)).toBeInTheDocument();
  });

  it('marks the All pill active when value is null', () => {
    render(<CurriculumFilter value={null} onChange={() => {}} />);
    const allBtn = screen.getByText('All');
    expect(allBtn.className).toMatch(/bg-primary/);
  });

  it('marks the matching option active when value matches its id', () => {
    render(<CurriculumFilter value="ssc" onChange={() => {}} />);
    const sscBtn = screen.getByText('SSC Prep');
    expect(sscBtn.className).toMatch(/bg-primary/);
  });

  it('calls onChange(null) when All is clicked', () => {
    const onChange = vi.fn();
    render(<CurriculumFilter value="ssc" onChange={onChange} />);
    fireEvent.click(screen.getByText('All'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange with the option id when an option is clicked', () => {
    const onChange = vi.fn();
    render(<CurriculumFilter value={null} onChange={onChange} />);
    fireEvent.click(screen.getByText('HSC Prep'));
    expect(onChange).toHaveBeenCalledWith('hsc');
  });
});
