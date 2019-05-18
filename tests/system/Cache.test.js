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
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.handlebars');
  expect(system.Cache('Test').cache([__dirname, 'TestFolder', 'test2.md'])).toEqual({ created: true, path: fullPath, contents: '<h1 id=\"test\">test</h1>\n' });
});

test('cache returns bad object when can\'t find a file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test4.md.handlebars');
  expect(system.Cache('Test').cache([__dirname, 'TestFolder', 'test4.md']).created).toEqual(false);
});

test('cache actually creates an HTML file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test');
  expect(fs.existsSync(fullPath)).toBe(true);
});

test('retrieveFullCachePath gives correct full path to cache file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.handlebars');
  expect(system.Cache('Test').retrieveFullCachePath('test2.md')).toBe(fullPath);
});

test('remove correctly returns when given good file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.handlebars');
  expect(system.Cache('Test').remove('test2.md.handlebars')).toEqual({ removed: true, path: fullPath });
});

test('remove correctly returns false when given bad file', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test3.md.handlebars');
  expect(system.Cache('Test').remove('test3.md.handlebars').removed).toBe(false);
});

test('remove correctly removes file from cache', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.handlebars');
  expect(fs.existsSync(fullPath)).toBe(false);
});

test('delete correctly returns given good folder', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test');
  system.Cache('Test').cache([__dirname, 'TestFolder', 'test2.md']);
  system.Cache('Test').cache([__dirname, 'TestFolder', 'test3.md']);
  expect(system.Cache('Test').delete()).toEqual({ removed: true, path: fullPath });
});

test('delete correctly returns given empty folder', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Testabc');
  system.Cache('Testabc').setup();
  expect(system.Cache('Testabc').delete()).toEqual({ removed: true, path: fullPath });
});

test('delete correctly returns given bad folder', () => {
  expect(system.Cache('Tests').delete().removed).toEqual(false);
});

test('delete correctly deletes project folder from cache', () => {
  const fullPath = path.join(process.cwd(), 'lib', 'system', 'cache', 'Test', 'test2.md.handlebars');
  expect(fs.existsSync(fullPath)).toBe(false);
});
