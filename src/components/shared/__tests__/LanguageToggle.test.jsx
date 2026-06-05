import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '../../../i18n';
import LanguageToggle from '../LanguageToggle';

describe('LanguageToggle', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders with the EN-active label (showing target language বাংলা)', () => {
    render(<LanguageToggle />);
    const btn = screen.getByLabelText('Toggle language');
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toMatch(/বাংলা/);
  });

  it('switches to English label when current language is bn', () => {
    i18n.changeLanguage('bn');
    render(<LanguageToggle />);
    const btn = screen.getByLabelText('Toggle language');
    expect(btn.textContent).toMatch(/English/);
  });

  it('calls changeLanguage on click', () => {
    render(<LanguageToggle />);
    const btn = screen.getByLabelText('Toggle language');
    fireEvent.click(btn);
    expect(i18n.language).toBe('bn');
  });
});
