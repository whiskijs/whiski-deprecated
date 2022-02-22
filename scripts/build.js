const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

/* client */

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  plugins: [nodeExternalsPlugin()],
});
build({
  entryPoints: ['plugins/typescript/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/plugins/typescript.js',
  plugins: [nodeExternalsPlugin()],
});
