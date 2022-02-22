export interface InstallOptions {
  plugins: any[];
}
export interface Plugin {
  name?: string;
  resolveConfig?: (config: InstallOptions) => void | Promise<void>;
  transform?: (id: string, code: string) => string | Promise<string>;
  transformImportUrl?: (url: string) => string | Promise<string>;
}
