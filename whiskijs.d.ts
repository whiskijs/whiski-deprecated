declare module 'whiskijs' {
  export interface InstallOptions {
    plugins: any[];
  }
  export interface Plugin {
    name?: string;
    resolveConfig?: (config: InstallOptions) => void | Promise<void>;
    transform?: (id: string, code: string) => string | Promise<string>;
    transformImportUrl?: (url: string) => string | Promise<string>;
  }

  export default function InstallModule(url: string, options?: InstallOptions): Promise<void>;
}
