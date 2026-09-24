const fs = require('fs');
const minify = require('html-minifier-terser').minify;

const input = fs.readFileSync('index.html', 'utf8');

async function build() {
  let output = await minify(input, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
    minifyCSS: false,
    minifyJS: false
  });

    output = output.replace(
    'style/styles.css',
    'style/styles.min.css'
  );

  fs.mkdirSync('dist', { recursive: true });

  fs.writeFileSync('dist/index.html', output);

  console.log('✓ HTML otimizado: dist/index.html');
}

build().catch(error => {
  console.error('Erro ao otimizar HTML:', error);
  process.exit(1);
});