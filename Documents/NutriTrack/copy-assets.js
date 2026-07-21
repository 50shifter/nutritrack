const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, 'dist');
const excludes = ['node_modules', 'dist', '.github', 'nginx', 'Dockerfile', 'docker-compose.yml', 'clean-dist.js', 'copy-assets.js'];

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const items = fs.readdirSync(src);
  items.forEach(item => {
    if (excludes.includes(item)) return;
    if (item.startsWith('.')) return;

    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 ${dest}/${item}`);
    }
  });
}

console.log('🚀 Копирование файлов в dist/...');
copyDir(__dirname, dist);
console.log('✅ Сборка завершена!');