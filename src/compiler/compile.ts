/* eslint-disable consistent-return */
/* eslint-disable global-require */
import * as acorn from 'acorn';
import { outputFile } from 'fs-extra';
import path, { join, normalize } from 'path';
import RandomString from '../../lib/randomString';
import install from '../install';
import { InstallOptions, Plugin } from '../types/options';

let modules = [];

export default async function Compile(code: string, id: string, opts: InstallOptions): Promise<string> {
  await opts.plugins.forEach(async (plugin: Plugin) => {
    if (plugin.resolveConfig) plugin.resolveConfig(opts);
    if (plugin.transform) code = await plugin.transform(id, code);
  });

  try {
    const parser = acorn.Parser.extend(require('acorn-class-fields')).extend(require('acorn-private-methods'));
    const ast = parser.parse(code, {
      ecmaVersion: 2020,
      sourceType: 'module',
      allowHashBang: true,
    });
    let replaced = 0;
    await (ast as any).body.forEach(async (spec: any) => {
      if (spec.type === 'ImportDeclaration') {
        let replacement = spec.source.value;
        const rep = replacement.replace(/[\\]/g, '/');
        if (!rep.startsWith('./') && !rep.startsWith('../')) {
          modules.push(rep);
          return;
        }
        let isUrl = false;

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
    console.log(e.message);
    outputFile(join(process.cwd(), './.whiski/.errors', RandomString()), `/* ${id} */\n${code}`);
    return code;
  }
}

export function init() {
  modules = [];
}
export function getModules() {
  return modules;
}
