/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable global-require */
import * as babel from '@babel/parser';
import { outputFile } from 'fs-extra';
import path, { join, normalize } from 'path';
import normalizeUrl from '../../lib/normalize';
import RandomString from '../../lib/randomString';
import { install } from '../install';
import { InstallOptions, Plugin } from '../types/options';

export default async function Compile(code: string, id: string, opts: InstallOptions): Promise<{ code: string; modules: string[] }> {
  const modules = [];

  await opts.plugins.forEach(async (plugin: Plugin) => {
    if (plugin.resolveConfig) plugin.resolveConfig(opts);
    if (plugin.transform) code = await plugin.transform(id, code);
  });

  try {
    const ast = babel.parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
    let replaced = 0;
    await ast.program.body.forEach(async (spec: any) => {
      if (spec.type === 'ImportDeclaration' || spec.type === 'ExportNamedDeclaration' || spec.type === 'ExportAllDeclaration') {
        if (!spec.source) return;

        let isUrl = false;
        let replacement = spec.source.value;
        const rep = normalizeUrl(replacement);

        if (!rep.startsWith('./') && !rep.startsWith('../')) {
          modules.push(rep);
          return;
        }

        // check url
        try {
          new URL(replacement);
          isUrl = true;
        } catch (e) {
          replacement = normalize(replacement);
        }

        if (!isUrl) {
          replacement = join(path.dirname(id), replacement);
        }

        if (!(replacement as string).split('\\').pop().includes('.')) {
          replacement = `${replacement}${path.extname(id)}`;
        }

        await install(replacement, opts);

        code = code.substring(0, spec.source.start + 1 + replaced) + replacement + code.substring(spec.source.end - 1 + replaced);
        replaced += replacement.length - spec.source.value.length;
      }
      return code;
    });
  } catch (e) {
    const cd = RandomString();
    console.log(`${'warn'.yellow} couldn't parse code. see code: ./.whiski/.errors/${cd}`);
    outputFile(join(process.cwd(), './.whiski/.errors/', cd), `/* ${id} */\n${code}`);
  }
  return { code, modules };
}
