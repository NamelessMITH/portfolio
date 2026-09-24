

# 🚀 Receita para criar um build automatizado

Vou considerar um projeto simples:

```text
meu-projeto/
├── index.html
├── style/
│   └── styles.css
├── img/
└── ...
```

O objetivo será chegar em:

```text
meu-projeto/
├── index.html              ← fonte
├── style/
│   └── styles.css          ← fonte
├── img/                    ← imagens originais
│
├── scripts/                ← automações
├── dist/                   ← versão de produção
│
├── package.json
├── package-lock.json
└── postcss.config.js
```

---

## 1. Abra o terminal na pasta do projeto

No Git Bash:

```bash
cd caminho/do/seu/projeto
```

Por exemplo:

```bash
cd ~/Desktop/meu-projeto
```

---

## 2. Inicialize o npm

```bash
npm init -y
```

Isso cria:

```text
package.json
```

O `package.json` será o arquivo que vai guardar as ferramentas e comandos do projeto.

---

# 3. Instale as ferramentas

Para o que fizemos no seu projeto:

```bash
npm install --save-dev postcss postcss-cli cssnano html-minifier-terser
```

Você está dizendo ao npm:

> "Instale ferramentas que só preciso durante o desenvolvimento/build."

Elas ficarão em:

```text
node_modules/
```

E serão registradas no:

```text
package.json
```

---

# 4. Crie a configuração do PostCSS

Na raiz do projeto:

```bash
touch postcss.config.js
```

Coloque:

```js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

Esse arquivo informa ao PostCSS:

> "Quando processar CSS, use o cssnano."

---

# 5. Crie a pasta dos scripts

```bash
mkdir -p scripts
```

Ela ficará assim:

```text
meu-projeto/
└── scripts/
```

Aqui colocaremos nossas automações.

---

# 6. Crie o script de HTML

```bash
touch scripts/build-html.js
```

Coloque:

```js
const fs = require('fs');
const minify = require('html-minifier-terser').minify;

const input = fs.readFileSync('index.html', 'utf8');

async function build() {
  const output = await minify(input, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
    minifyCSS: false,
    minifyJS: false
  });

  fs.mkdirSync('dist', { recursive: true });

  fs.writeFileSync('dist/index.html', output);

  console.log('✓ HTML otimizado: dist/index.html');
}

build().catch(error => {
  console.error('Erro ao otimizar HTML:', error);
  process.exit(1);
});
```

Responsabilidade:

```text
index.html
     ↓
build-html.js
     ↓
dist/index.html
```

---

# 7. Crie o script das imagens

```bash
touch scripts/copy-images.js
```

Coloque:

```js
const fs = require('fs');

const source = 'img';
const destination = 'dist/img';

fs.mkdirSync(destination, { recursive: true });

fs.cpSync(source, destination, {
  recursive: true
});

console.log('✓ Imagens copiadas: dist/img');
```

Responsabilidade:

```text
img/
 ↓
copy-images.js
 ↓
dist/img/
```

---

# 8. Configure os comandos no `package.json`

Abra:

```text
package.json
```

Procure:

```json
"scripts": {
}
```

E coloque:

```json
"scripts": {
  "build:css": "postcss style/styles.css -o dist/style/styles.min.css",
  "build:html": "node scripts/build-html.js",
  "build:images": "node scripts/copy-images.js",
  "build": "npm run build:css && npm run build:html && npm run build:images"
}
```

Agora você tem quatro comandos:

### CSS

```bash
npm run build:css
```

### HTML

```bash
npm run build:html
```

### Imagens

```bash
npm run build:images
```

### Tudo

```bash
npm run build
```

---

# 9. Crie a pasta `dist`

Você pode criar manualmente:

```bash
mkdir -p dist
```

Mas os próprios scripts conseguem criar as pastas necessárias.

---

# 10. Rode o build completo

Agora vem a parte mais legal:

```bash
npm run build
```

O npm executará:

```text
build:css
    ↓
build:html
    ↓
build:images
```

E você terá:

```text
dist/
├── index.html
├── style/
│   └── styles.min.css
└── img/
    ├── imagem1.jpg
    ├── imagem2.png
    └── ...
```

---

# 11. Regra de ouro

Depois que montar isso, **não edite os arquivos dentro de `dist`**.

Você sempre trabalha nos arquivos originais:

```text
index.html
style/styles.css
img/
```

Depois:

```bash
npm run build
```

E a versão de produção é recriada.

Pense assim:

```text
        VOCÊ EDITA
             ↓
┌──────────────────────────┐
│ index.html               │
│ style/styles.css         │
│ img/                     │
└──────────────────────────┘
             ↓
       npm run build
             ↓
┌──────────────────────────┐
│          dist/           │
│                          │
│ index.html               │
│ styles.min.css           │
│ imagens                  │
└──────────────────────────┘
             ↓
        PUBLICAÇÃO
```

---

# 🧠 Checklist para qualquer projeto futuro

Quando começar outro projeto, você pode seguir esta ordem:

```text
[ ] 1. Criar projeto
[ ] 2. npm init -y
[ ] 3. Instalar dependências
[ ] 4. Criar postcss.config.js
[ ] 5. Criar scripts/
[ ] 6. Criar build-html.js
[ ] 7. Criar copy-images.js
[ ] 8. Configurar scripts no package.json
[ ] 9. Rodar npm run build
[ ] 10. Conferir a pasta dist/
```

E a lógica que você precisa guardar é esta:

> **Source → Build → Dist**

```text
ARQUIVOS FONTE
     ↓
npm run build
     ↓
ARQUIVOS OTIMIZADOS
     ↓
PUBLICAÇÃO
```

Esse conceito é muito mais importante do que decorar os comandos. Depois que você entende **Source → Build → Dist**, fica bem mais fácil entender ferramentas como Vite, Webpack e outros sistemas de build.
