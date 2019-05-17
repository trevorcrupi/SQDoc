const system = require('../../lib/system');
const path = require('path');
const fs   = require('fs');

test('setup creates returns correct cache stuff', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test');
  expect(system.Cache('Test').setup()).toBe(true);
});

test('setup actually creates the folder', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test');
  expect(fs.existsSync(fullPath)).toBe(true);
});

test('cache returns correct object when creating a file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.html');
  expect(system.Cache('Test').cache([__dirname, 'TestFolder', 'test2.md'])).toStrictEqual({ created: true, path: fullPath, contents: '<h1 id=\"test\">test</h1>\n' });
});

test('cache actually creates an HTML file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test');
  expect(fs.existsSync(fullPath)).toBe(true);
});

test('retrieveFullCachePath returns false when given bad file', () => {
  expect(system.Cache('Test').retrieveFullCachePath('test3.md.html')).toBe(false);
});

test('retrieveFullCachePath gives correct full path to cache file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.html');
  expect(system.Cache('Test').retrieveFullCachePath('test2.md.html')).toBe(fullPath);
});