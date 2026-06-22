import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AiResponseCard from '../AiResponseCard';

describe('AiResponseCard HTML Preview', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn(() => ({})));
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn()
    });
  });

  it('renders Preview button for HTML code block', () => {
    const htmlPayload = {
      templateType: 'unified',
      topic: 'HTML Table Demo',
      solution: {
        title: 'Solution HTML',
        explanation: 'Here is a custom HTML table',
        codeOrMath: '<!DOCTYPE html><html><body><table><tr><td>Cell</td></tr></table></body></html>'
      },
      insights: {
        title: 'Insights',
        cards: []
      }
    };

    render(<AiResponseCard structured={htmlPayload} />);
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('does not render Preview button for Python code block', () => {
    const pythonPayload = {
      templateType: 'unified',
      topic: 'Python Print Demo',
      solution: {
        title: 'Solution Python',
        explanation: 'Here is a python print',
        codeOrMath: 'print("Hello World")'
      },
      insights: {
        title: 'Insights',
        cards: []
      }
    };

    render(<AiResponseCard structured={pythonPayload} />);
    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
  });

  it('clicking Preview opens window with blob URL', () => {
    const htmlPayload = {
      templateType: 'unified',
      topic: 'HTML Table Demo',
      solution: {
        title: 'Solution HTML',
        explanation: 'Here is a custom HTML table',
        codeOrMath: '<div>Hello</div>'
      },
      insights: {
        title: 'Insights',
        cards: []
      }
    };

    render(<AiResponseCard structured={htmlPayload} />);
    const previewBtn = screen.getByText('Preview');
    fireEvent.click(previewBtn);

    expect(window.open).toHaveBeenCalledWith('blob:mock-url', '_blank');
  });
});
