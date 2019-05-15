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
    { level: 1, type: 'directory', name: 'TestFolders' },
    { level: 2, type: 'directory', name: 'FirstFolder' },
    { level: 3, type: 'file', name: 'FirstFolder.md' },
    { level: 2, type: 'file', name: 'root.md' },
    { level: 2, type: 'directory', name: 'SecondFolder' },
    { level: 3, type: 'file', name: 'SecondFolder.md' }
  ];

  expect(controller.tree(filepath).tree).toStrictEqual(correctTree);
});

test('returns correct filetree output', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const ffolder = colors.green('FirstFolder.md');
  const root = colors.green('root.md');
  const sfolder = colors.green('SecondFolder.md');

  const correctString = `TestFolders\n |─FirstFolder\n |──${ffolder}\n |─${root}\n |─SecondFolder\n |──${sfolder}\n`
  expect(controller.tree(filepath).output).toBe(correctString);
});
