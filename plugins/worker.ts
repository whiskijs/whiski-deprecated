/* eslint-disable no-return-await */
export default async function pluginworker(func, ...args: any[]): Promise<any> {
  if (typeof func !== 'function') {
    throw new Error('pluginworker: first argument must be a function');
  }
  return await func(...args);
}
