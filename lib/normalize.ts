export default function normalizeUrl(path: string): string {
  path = path.replace(/\\/g, '/');
  path = path.replace(/https:\//, 'https://');
  path = path.replace(/http:\//, 'http://');
  return path;
}
