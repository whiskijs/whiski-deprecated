import normalizeUrl from '../lib/normalize';

test('normalize url', () => {
  expect(normalizeUrl('/test/test.js')).toBe('/test/test.js');
  expect(normalizeUrl('\\test\\test.js')).toBe('/test/test.js');
  expect(normalizeUrl('https:/google.com')).toBe('https://google.com');
  expect(normalizeUrl('https:\\google.com')).toBe('https://google.com');
});
