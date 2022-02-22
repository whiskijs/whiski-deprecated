import TypescriptPlugin from '../plugins/typescript';
import Compile from '../src/compiler/compile';

test('Typescript Plugin', async () => {
  const compiled = await Compile('const a: string = "hello";', 'test.ts', { plugins: [TypescriptPlugin()] });
  expect(compiled.split(/\r?\n/).join('')).toEqual('"use strict";const a = "hello";');
});
