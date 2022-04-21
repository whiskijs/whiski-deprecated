#!/usr/bin/env node

const whiski = require('whiski');

(async () => {
  const args = process.argv.slice(2);
  const opts = {};
  const urls = [];

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      opts[key] = value;
    } else {
      urls.push(arg);
    }
  });

  const outOpt = {};

  if (opts) {
    if (opts.out) {
      outOpt.outDir = opts.out;
    }
    if (opts.extension) {
      outOpt.extension = opts.extension;
    }
  }

  await whiski.install(urls.join(' '), outOpt);
})();
