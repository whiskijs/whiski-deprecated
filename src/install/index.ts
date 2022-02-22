import * as fetch from 'node-fetch';
import 'colors';
import { outputFileSync } from 'fs-extra';
import { join } from 'path';
import { InstallOptions, Plugin } from '../types/options';
import Compile, { getModules, init } from '../compiler/compile';
import RandomString from '../../lib/randomString';

export default async function InstallModule(url: string, options?: InstallOptions): Promise<void> {
  const start = performance.now();
  init();
  options.plugins.forEach(async (plugin: Plugin) => {
    if (plugin.transformImportUrl) url = await plugin.transformImportUrl(url);
  });

  const response = await fetch.default(url);
  if (response.status === 200) {
    const code = await response.text();
    outputFileSync(join(process.cwd(), `./.whiski/${new URL(url).pathname}`), code);
    console.log(
      `${'success'.green.bold} install ${url.bold} - ${((performance.now() - start) / 100).toFixed(2)}s${
        getModules().length === 0 ? '' : `\n└─ failed Modules: ${getModules().join(', ')}`.red.bold
      }`
    );
    Compile(code, url, options);
  } else {
    console.log(`${'fail'.red.bold} install ${url.bold}`);
  }
}
