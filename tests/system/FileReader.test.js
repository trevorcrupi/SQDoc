const system = require('../../lib/system');
const path = require('path');
const fs   = require('fs');

test('exists returns false when given bad path', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test3.md');
  expect(system.FileReader.exists(testPath)).toBe(false);
});

test('exists returns false when given nothing', () => {
  expect(system.FileReader.exists()).toBe(false);
});

test('exists returns true when given good path', () => {
  const testPath = path.join(__dirname, 'TestFolder', 'test2.md');
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
  const testPath = path.join(__dirname, 'TestFolder', 'test3.md');
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
  const testPath = path.join(__dirname, 'TestFolder', 'test2.md');
  expect(system.FileReader.getFileContents(testPath)).toBe('# test');
});

test('Join returns the same as path.join for two strings', () => {
  const thingA = 'akafajs-iadsnrn';
  const thingB = '12345a789s52ks$5%';
  const test = path.join(thingA, thingB);
  expect(system.FileReader.join([thingA, thingB])).toBe(test);
});

test('Join returns the same as path.join for longer strings', () => {
  const thingA = 'akafajs-iadsnrn';
  const thingB = '12345a789s52ks$5%';
  const thingC = 'adfsaj+adsfajh-as';
  const thingD = 'adfhnjridred()-a';
  const test1 = path.join(thingA, thingB);
  const test2 = path.join(thingC, thingD);
  expect(system.FileReader.join([thingA, thingB, thingC, thingD])).toBe(path.join(test1, test2));
});
