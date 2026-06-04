const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && !dirPath.includes('node_modules') && !dirPath.includes('.git') && !dirPath.includes('.next')) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.tsx') || f.endsWith('.ts')) {
            callback(dirPath);
        }
    });
}

let modified = 0;
walkDir('./src', (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // regex to match w-X h-X or h-X w-X
    const regex1 = /\bw-([a-z0-9\-\.\/]+)\s+h-\1\b/g;
    const regex2 = /\bh-([a-z0-9\-\.\/]+)\s+w-\1\b/g;
    
    content = content.replace(regex1, 'size-$1');
    content = content.replace(regex2, 'size-$1');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        modified++;
    }
});

console.log(`Modified ${modified} files.`);