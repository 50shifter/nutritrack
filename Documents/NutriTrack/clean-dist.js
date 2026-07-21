const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, 'dist');

// Удалить dist/
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
  console.log('✅ dist/ очищен');
}

// Создать пустой dist
fs.mkdirSync(dist, { recursive: true });
console.log('✅ dist/ готов к сборке');