import * as fetch from 'node-fetch';
import 'colors';
import { outputFileSync } from 'fs-extra';
import path, { join } from 'path';
import { InstallOptions, Plugin } from '../types/options';
import Compile, { getModules, init } from '../compiler/compile';
import normalizeUrl from '../../lib/normalize';

let history = [];

export default async function InstallModule(url: string, options?: InstallOptions): Promise<void> {
  if (history.includes(url)) return;
  options = { extension: 'js', plugins: [], ...options };

  const start = performance.now();
  init();
  options.plugins.forEach(async (plugin: Plugin) => {
    if (plugin.transformImportUrl) url = await plugin.transformImportUrl(url);
  });
  if (options.debug) console.log(`${'info'.blue} fetching ${url}`);

  const parsed = path.parse(url);

  const response = await fetch.default(url);
  if (response.status === 200) {
    history.push(url);
    const code = await response.text();
    outputFileSync(join(process.cwd(), `./.whiski/${new URL(url).pathname}`), code);
    console.log(
      `${'success'.green.bold} install ${normalizeUrl(url).bold} - ${((performance.now() - start) / 100).toFixed(2)}s${
        getModules().length === 0 ? '' : `\n└─ failed Modules: ${getModules().join(', ')}`.red.bold
      }`
    );
    Compile(code, url, options);
  } else if (!history.includes(`${parsed.dir}/${parsed.name}/index.${options.extension}`)) {
    await InstallModule(`${parsed.dir}/${parsed.name}/index.${options.extension}`, options);
    history.push(`${parsed.dir}/${parsed.name}/index.${options.extension}`);
  } else if (!history.includes(url)) {
    console.log(`${'failed'.red.bold} install ${normalizeUrl(url).bold}`);
  }
}

export function refresh() {
  history = [];
}
