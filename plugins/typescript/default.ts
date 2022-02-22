export const tsconfig = {
  compilerOptions: {
    target: 'ESNext',
    useDefineForClassFields: true,
    module: 'ESNext',
    lib: ['ESNext', 'DOM'],
    moduleResolution: 'Node',
    strict: true,
    resolveJsonModule: true,
    esModuleInterop: true,
    noEmit: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  },
};
