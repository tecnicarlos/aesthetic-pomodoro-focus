const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.html');

try {
    let html = fs.readFileSync(indexPath, 'utf8');

    // Replace absolute paths with relative paths
    html = html.replace(/src="\//g, 'src="./');
    html = html.replace(/href="\//g, 'href="./');

    // Fix module loading for import.meta support
    html = html.replace(/<script src="/g, '<script type="module" src="');

    fs.writeFileSync(indexPath, html);
    console.log('Successfully updated paths in dist/index.html');
} catch (error) {
    console.error('Error fixing paths:', error);
    process.exit(1);
}
