/* eslint-disable import/no-extraneous-dependencies */
import * as ts from 'typescript';
import { Plugin } from '../../src/types/options';
import { tsconfig } from './default';

export default function TypescriptPlugin(): Plugin {
  return {
    name: 'typescript-plugin',
    transform(id: string, code: string): string {
      if (id.endsWith('.ts')) {
        const dist = ts.transpileModule(code, tsconfig as any).outputText;
        return dist;
      }
      return code;
    },
  };
}
