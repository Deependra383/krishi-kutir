import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
            results = results.concat(walk(filePath));
          }
        } else {
          if (/\.(png|jpg|jpeg|gif|webp)$/i.test(file)) {
            results.push(filePath);
          }
        }
      } catch (e) {}
    });
  } catch (e) {}
  return results;
}

console.log('Images in /tmp:', walk('/tmp'));
console.log('Images in /app:', walk('/app'));
