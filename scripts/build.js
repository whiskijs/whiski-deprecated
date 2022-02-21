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
