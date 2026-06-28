const { createHighlighter } = require('shiki');

async function main() {
    const highlighter = await createHighlighter({
        themes: ['github-dark'],
        langs: ['html']
    });

    const code = "<!DOCTYPE html>\n<html>\n<head>\n    <title>Example</title>\n</head>\n<body>\n</body>\n</html>";
    const html = highlighter.codeToHtml(code, {
        lang: 'html',
        theme: 'github-dark'
    });
    console.log(html);
}

main();
