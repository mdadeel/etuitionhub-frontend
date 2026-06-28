const { createHighlighter } = require('shiki');

async function main() {
    const highlighter = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['html']
    });

    const code = "<!DOCTYPE html>\n<html>";
    const html = highlighter.codeToHtml(code, {
        lang: 'html',
        themes: {
            light: 'github-light',
            dark: 'github-dark'
        }
    });
    console.log(html);
}

main();
