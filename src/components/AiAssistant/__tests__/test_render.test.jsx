import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer.jsx';
import AiResponseCard from '../AiResponseCard.jsx';

describe('MarkdownRenderer Test', () => {
  it('renders code block HTML', async () => {
    const content = `
Here is a code block:

\`\`\`javascript
const x = 1;
const y = 2;
console.log(x + y);
\`\`\`
`;
    const { container } = render(<MarkdownRenderer content={content} />);
    
    // Wait for the shiki-container to render
    await waitFor(() => {
      const shiki = container.querySelector('.shiki-container');
      if (!shiki) throw new Error('Not rendered yet');
    }, { timeout: 5000 });

    console.log("SHIKI RENDERED HTML:", container.querySelector('.shiki-container').innerHTML);
  });

  it('renders ProgrammingTemplate with Shiki correctly', async () => {
    const payload = {
      templateType: 'programming',
      topic: 'JavaScript Variables',
      codeExplanation: 'We declare x and y, then log their sum.',
      solution: 'const x = 5;\nconst y = 10;\nconsole.log(x + y);',
      needsHumanHelp: false,
      recommendedSubject: 'programming'
    };

    const { container } = render(<AiResponseCard structured={payload} />);

    // Wait for Shiki highlighting in CodeBlock
    await waitFor(() => {
      const shiki = container.querySelector('.shiki-container');
      if (!shiki) throw new Error('Shiki not loaded yet');
    }, { timeout: 5000 });

    console.log("PROGRAMMING CARD SHIKI HTML:", container.querySelector('.shiki-container').innerHTML);
  });

  it('renders inline code as code tag without pre', () => {
    const content = 'You should use `const x = 5` in your script.';
    const { container } = render(<MarkdownRenderer content={content} />);
    
    // There should be a code tag, but NO shiki-container or pre tag
    const codeTag = container.querySelector('code');
    const preTag = container.querySelector('pre');
    const shiki = container.querySelector('.shiki-container');

    expect(codeTag).not.toBeNull();
    expect(preTag).toBeNull();
    expect(shiki).toBeNull();
    expect(codeTag.textContent).toBe('const x = 5');
    console.log("INLINE CODE HTML:", container.innerHTML);
  });

  it('preserves JSX code syntax in CodeBlock', async () => {
    const payload = {
      templateType: 'programming',
      topic: 'React JSX Component',
      codeExplanation: 'Here is a simple React button component.',
      solution: 'const Button = () => {\n  return <MyButton label="Save" />\n};',
      needsHumanHelp: false,
      recommendedSubject: 'programming'
    };

    const { container } = render(<AiResponseCard structured={payload} />);

    // Wait for Shiki highlighting in CodeBlock
    await waitFor(() => {
      const shiki = container.querySelector('.shiki-container');
      if (!shiki) throw new Error('Shiki not loaded yet');
    }, { timeout: 5000 });

    // Verify that the JSX tag '<MyButton' is preserved in the rendered HTML,
    // and is not stripped as an invalid HTML tag.
    const renderedHtml = container.querySelector('.shiki-container').innerHTML;
    expect(renderedHtml).toContain('MyButton');
    expect(renderedHtml).toContain('label');
    console.log("PRESERVED JSX SHIKI HTML:", renderedHtml);
  });
});



