const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('./src/actions'), ...walk('./src/services')];

for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    let code = fs.readFileSync(file, 'utf8');
    
    // Make transactions async
    code = code.replace(/db\.transaction\(\(tx\)\s*=>\s*\{/g, 'db.transaction(async (tx) => {');
    
    // Replace .all() with nothing
    code = code.replace(/\.all\(\)/g, '');
    
    // Replace .get() with .then(res => res ? res[0] : undefined)
    code = code.replace(/\.get\(\)/g, '.then(res => res ? res[0] : undefined)');
    
    // Replace .run() with nothing
    code = code.replace(/\.run\(\)/g, '');
    
    // Add await to db. or tx. operations if not already awaited or returned
    code = code.replace(/(?<!await\s+)(?<!return\s+)(?<!\w)(db|tx)\.(select|insert|update|delete)/g, 'await $1.$2');

    fs.writeFileSync(file, code);
}
console.log('Refactoring complete.');
