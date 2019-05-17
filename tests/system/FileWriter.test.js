const system = require('../../lib/system');
const path = require('path');
const fs   = require('fs');

test('create does not create file when given path that exists', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test2.md');
  expect(system.FileWriter.create({ path: testPath, contents: 'some file contents' }).created).toBe(false);
});

test('creates file in given directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(system.FileWriter.create({ path: testPath, contents: 'some file contents' })).toEqual({ created: true, path: testPath, contents: 'some file contents' });
});

test('create actually creates a file', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(fs.existsSync(testPath)).toBe(true);
});

test('create does not create a file if given empty object', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(system.FileWriter.create().created).toBe(false);
});

test('removes file in given directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(system.FileWriter.remove({ path: testPath })).toEqual({ removed: true, path: testPath });
});

test('remove correctly removes file', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(fs.existsSync(testPath)).toBe(false);
});

test('remove returns false when given bad file', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test7.md');
  expect(system.FileWriter.remove({ path: testPath }).removed).toBe(false);
});

test('creates a directory at the given path', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1');
  expect(system.FileWriter.create({ path: testPath, isDir: true })).toEqual({ created: true, path: testPath, contents: null });  
});

test('create actually creates a directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1');
  expect(fs.existsSync(testPath)).toBe(true);
});

test('removes a directory at the given path', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1');
  expect(system.FileWriter.remove({ path: testPath, isDir: true })).toEqual({ removed: true, path: testPath });  
});

test('remove correctly removes directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1');
  expect(fs.existsSync(testPath)).toBe(false);
});

test('remove returns false when given bad directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test2');
  expect(system.FileWriter.remove({ path: testPath, isDir: true }).removed).toBe(false);
});
