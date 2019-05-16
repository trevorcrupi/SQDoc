const system = require('../../lib/system');
const path = require('path');
const fs   = require('fs');

test('exists returns false when given bad path', () => {
  const existTestFilePath = path.join('TestFolder', 'test1.md');
  const testPath = path.join(__dirname, existTestFilePath);
  expect(system.FileReader.exists(testPath)).toBe(false);
});

test('exists returns false when given nothing', () => {
  expect(system.FileReader.exists()).toBe(false);
});

test('exists returns true when given good path', () => {
  const existTestFilePath = path.join('TestFolder', 'test2.md');
  const testPath = path.join(__dirname, existTestFilePath);
  expect(system.FileReader.exists(testPath)).toBe(true);
});

test('exists returns true when given folder', () => {
  const testPath = path.join(__dirname, 'TestFolder');
  expect(system.FileReader.exists(testPath)).toBe(true);
});

test('getFileContents throws an error when no path given', () => {
  expect(() => {
    system.FileReader.getFileContents()
  }).toThrow();
});

test('getFileContents throws an error when getting contents from non-existent file', () => {
  const existTestFilePath = path.join('TestFolder', 'test1.md');
  const testPath = path.join(__dirname, existTestFilePath);
  expect(() => {
    system.FileReader.getFileContents(testPath)
  }).toThrow();
});

test('getFileContents throws an error when getting contents from folder', () => {
  const testPath = path.join(__dirname, 'TestFolder');
  expect(() => {
    system.FileReader.getFileContents(testPath)
  }).toThrow();
});

test('getFileContents returns correct contents given good path', () => {
  const existTestFilePath = path.join('TestFolder', 'test2.md');
  const testPath = path.join(__dirname, existTestFilePath);
  expect(system.FileReader.getFileContents(testPath)).toBe('# test');
});

test('Join returns the same as path.join', () => {
  const thingA = 'akafajs-iadsnrn';
  const thingB = '12345a789s52ks$5%';
  const test = path.join(thingA, thingB);
  expect(system.FileReader.join(thingA, thingB)).toBe(test);
});

test('retrieveFullCachePath returns false when given bad file', () => {
  expect(system.FileReader.retrieveFullCachePath()).toBe(false);
});

test('retrieveFullCachePath gives correct full path to cache file', () => {
  const cacheFile = path.join('Test', 'test2.md.html');
  const systemCache = path.join('system', 'cache');
  const rootLib = path.join(process.cwd(), 'lib');
  const fullPath = path.join(rootLib, path.join(systemCache, cacheFile));
  expect(system.FileReader.retrieveFullCachePath(cacheFile)).toBe(fullPath);
});

test('retrieveFullCachePath returns false when file doesn\'t exist', () => {
  const cacheFile = path.join('Test', 'test1.md.html');
  const systemCache = path.join('system', 'cache');
  const rootLib = path.join(process.cwd(), 'lib');
  const fullPath = path.join(rootLib, path.join(systemCache, cacheFile));
  expect(system.FileReader.retrieveFullCachePath(cacheFile)).toBe(false);
});

