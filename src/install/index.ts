import * as fetch from 'node-fetch';
import 'colors';
import { outputFileSync } from 'fs-extra';
import path, { join } from 'path';
import { InstallOptions, Plugin } from '../types/options';
import Compile from '../compiler/compile';
import normalizeUrl from '../../lib/normalize';

let history = [];

export async function install(url: string, options?: InstallOptions): Promise<void> {
  if (history.includes(url)) return;

  options = {
    extension: 'js',
    plugins: [],
    debug: false,
    log: true,
    ...options,
  };

  const start = performance.now();

  options.plugins.forEach(async (plugin: Plugin) => {
    if (plugin.transformImportUrl) url = await plugin.transformImportUrl(url);
  });

  if (options.debug) console.log(`${'info'.blue} fetching ${url}`);

  const parsed = path.parse(url);
  const response = await fetch.default(url);

  if (response.status === 200) {
    history.push(url);

    const code = await response.text();
    const { modules } = await Compile(code, url, options);

    outputFileSync(join(process.cwd(), `./.whiski/${new URL(url).pathname}`), code);

    if (options.log) {
      console.log(
        `${'success'.green.bold} install ${normalizeUrl(url).bold} - ${((performance.now() - start) / 100).toFixed(2)}s${
          modules.length === 0 ? '' : `\n└─ failed Modules: ${modules.join(', ')}`.red.bold
        }`
      );
    }
  } else if (!history.includes(`${parsed.dir}/${parsed.name}/index.${options.extension}`)) {
    await install(`${parsed.dir}/${parsed.name}/index.${options.extension}`, options);
    history.push(`${parsed.dir}/${parsed.name}/index.${options.extension}`);
  } else if (!history.includes(url)) {
    if (options.log) console.log(`${'failed'.red.bold} install ${normalizeUrl(url).bold}`);
  }
}

export function refresh() {
  history = [];
}
