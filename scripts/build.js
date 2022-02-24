const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const fs = require('fs');
const { join } = require('path');

const prod = fs.readFileSync(join(__dirname, '../build-package.json'), 'utf8');
const typing = fs.readFileSync(join(__dirname, '../whiskijs.d.ts'), 'utf8');
const readme = fs.readFileSync(join(__dirname, '../README.md'), 'utf8');

// For Publish

fs.writeFileSync(join(__dirname, '../dist/whiskijs.d.ts'), typing);
fs.writeFileSync(join(__dirname, '../dist/package.json'), prod);
fs.writeFileSync(join(__dirname, '../dist/README.md'), readme);

/* client */

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  plugins: [nodeExternalsPlugin()],
});

/*
build({
  entryPoints: ['plugins/typescript/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/plugins/typescript.js',
  plugins: [nodeExternalsPlugin()],
});
*/
