const path       = require('path');
const controller = require('../../lib/output').controller;
const dirTree    = require('directory-tree');
const cleaner    = require('../../lib/reader').cleaner;
const colors     = require('colors');

test('return error when given no filetree', () => {
  const errorObject = {
    'introduction': 'Documentation Structure',
    'error': 'filepath not defined'
  };
  expect(controller.tree()).toStrictEqual(errorObject);
});

test('returns correct introduction', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(controller.tree(filepath).introduction).toBe('Documentation Structure');
});

test('returns correct filetree', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctFiletree = dirTree(filepath, {
    extensions: /\md/
  });
  expect(controller.tree(filepath).complete).toStrictEqual(cleaner(correctFiletree));
});

test('returns correct documentation tree', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctTree = [
    { level: 1, type: 'directory', name: 'TestFolders', fullpath: '' },
    { level: 2, type: 'directory', name: 'FirstFolder', fullpath: 'FirstFolder' },
    { level: 3, type: 'directory', name: 'GHI', fullpath: path.join('FirstFolder', 'GHI') },
    { level: 4, type: 'file', name: 'GHI.md', fullpath: path.join('FirstFolder', path.join('GHI', 'GHI.md')) },
    { level: 3, type: 'file', name: 'FirstFolder.md', fullpath: path.join('FirstFolder', 'FirstFolder.md') },
    { level: 2, type: 'directory', name: 'SecondFolder', fullpath: 'SecondFolder' },
    { level: 3, type: 'file', name: 'SecondFolder.md', fullpath: path.join('SecondFolder', 'SecondFolder.md') },
    { level: 2, type: 'file', name: 'root.md', fullpath: 'root.md' }
  ];

  expect(controller.tree(filepath).structure.getTree()).toStrictEqual(correctTree);
});

test('returns correct documentation tree node by name', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correct = { level: 2, type: 'directory', name: 'SecondFolder', fullpath: 'SecondFolder' };
  expect(controller.tree(filepath).structure.getTreeNodeByName('SecondFolder')).toStrictEqual(correct);
});

test('returns correct filetree output', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const ffolder = colors.green('FirstFolder.md');
  const root = colors.green('root.md');
  const sfolder = colors.green('SecondFolder.md');

  const correctString = `TestFolders\n |─FirstFolder\n |──${ffolder}\n |─${root}\n |─SecondFolder\n |──${sfolder}\n`
  expect(controller.tree(filepath).output).toBe(correctString);
});

test('throws error when given no filename', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(() => {
    controller.tree(filepath).structure.getFileByName()
  }).toThrow();
});

test('throws error when given no directory name', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(() => {
    controller.tree(filepath).structure.getTreeNodeByName()
  }).toThrow();
});

test('correctly returns array of all files', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctArray = [
    { level: 3, type: 'file', name: 'FirstFolder.md', fullpath:path.join('FirstFolder', 'FirstFolder.md') },
    { level: 2, type: 'file', name: 'root.md', fullpath: 'root.md' },
    { level: 3, type: 'file', name: 'SecondFolder.md', fullpath: path.join('SecondFolder', 'SecondFolder.md') }
  ];
  expect(controller.tree(filepath).structure.getFiles()).toStrictEqual(correctArray);
})

test('returns correct file by name', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correct = { level: 3, type: 'file', name: 'SecondFolder.md', fullpath: path.join('SecondFolder', 'SecondFolder.md') };
  expect(controller.tree(filepath).structure.getFileByName('SecondFolder.md')).toStrictEqual(correct);
});
