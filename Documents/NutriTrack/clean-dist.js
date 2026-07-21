const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, 'dist');

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
  console.log('✅ dist/ очищен');
}

fs.mkdirSync(dist, { recursive: true });
console.log('✅ dist/ готов к сборке');