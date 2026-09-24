const fs = require('fs');
const path = require('path');

const source = 'img';
const destination = 'dist/img';

fs.mkdirSync(destination, { recursive: true });

fs.cpSync(source, destination, {
  recursive: true
});

console.log('✓ Imagens copiadas: dist/img');