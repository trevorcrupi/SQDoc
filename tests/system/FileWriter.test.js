const system = require('../../lib/system');
const path = require('path');
const fs   = require('fs');

test('create does not create file when given path that exists', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test2.md');
  expect(system.FileWriter.create({ path: testPath, contents: 'some file contents' })).toStrictEqual({ created: false });
});

test('creates file in given directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(system.FileWriter.create({ path: testPath, contents: 'some file contents' })).toStrictEqual({ created: true, path: testPath, contents: 'some file contents' });
});

test('removes file in given directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1.md');
  expect(system.FileWriter.remove({ path: testPath })).toStrictEqual({ removed: true, path: testPath });
});

test('remove returns false when given bad file', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test3.md');
  expect(system.FileWriter.remove({ path: testPath })).toStrictEqual({ removed: false });
});

test('creates a directory at the given path', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1');
  expect(system.FileWriter.create({ path: testPath, isDir: true })).toStrictEqual({ created: true, path: testPath, contents: null });  
});

test('removes a directory at the given path', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test1');
  expect(system.FileWriter.remove({ path: testPath, isDir: true })).toStrictEqual({ removed: true, path: testPath });  
});

test('remove returns false when given bad directory', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test2');
  expect(system.FileWriter.remove({ path: testPath, isDir: true })).toStrictEqual({ removed: false });
});

