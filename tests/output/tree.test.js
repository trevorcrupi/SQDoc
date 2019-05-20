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
  expect(controller.tree()).toEqual(errorObject);
});

test('returns correct introduction', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(controller.tree(filepath).introduction).toBe('Documentation Structure');
});

test('returns correct documentation tree', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctTree = [
    { level: 0, parent: '', type: 'directory', name: 'TestFolders', fullpath: '' },
    { level: 1, parent: 'TestFolders', type: 'directory', name: 'FirstFolder', fullpath: 'FirstFolder' },
    { level: 2, parent: 'FirstFolder', type: 'directory', name: 'GHI', fullpath: path.join('FirstFolder', 'GHI') },
    { level: 3, parent: 'GHI', type: 'file', name: 'GHI.md', fullpath: path.join('FirstFolder', 'GHI') },
    { level: 2, parent: 'FirstFolder', type: 'file', name: 'FirstFolder.md', fullpath: path.join('FirstFolder') },
    { level: 1, parent: 'TestFolders', type: 'directory', name: 'SecondFolder', fullpath: 'SecondFolder' },
    { level: 2, parent: 'SecondFolder', type: 'file', name: 'SecondFolder.md', fullpath: path.join('SecondFolder') },
    { level: 1, parent: 'TestFolders', type: 'file', name: 'root.md', fullpath: '' }
  ];

  expect(controller.tree(filepath).structure.getTree()).toStrictEqual(correctTree);
});

test('returns correct indexed tree', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctTree = {
    'TestFolders': 0,
    'FirstFolder': 1,
    'GHI': 2,
    'GHI.md': 3,
    'FirstFolder.md': 4,
    'SecondFolder': 5,
    'SecondFolder.md': 6,
    'root.md': 7
  };
  expect(controller.tree(filepath).structure.getIndexedTree()).toStrictEqual(correctTree);
});

test('returns correct index by name, exists', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctTree = {
    'TestFolders': 0,
    'FirstFolder': 1,
    'GHI': 2,
    'GHI.md': 3,
    'FirstFolder.md': 4,
    'SecondFolder': 5,
    'SecondFolder.md': 6,
    'root.md': 7
  };
  expect(controller.tree(filepath).structure.getTreeIndexByName('FirstFolder.md')).toBe(4);
});

test('returns correct index by name, nonexistent', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctTree = {
    'TestFolders': 0,
    'FirstFolder': 1,
    'GHI': 2,
    'GHI.md': 3,
    'FirstFolder.md': 4,
    'SecondFolder': 5,
    'SecondFolder.md': 6,
    'root.md': 7
  };
  expect(controller.tree(filepath).structure.getTreeIndexByName('asadghtdd.md')).toBe(undefined);
});

test('returns correct documentation tree node by name', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correct = { level: 1, parent: 'TestFolders', type: 'directory', name: 'SecondFolder', fullpath: 'SecondFolder' };
  expect(controller.tree(filepath).structure.getTreeNodeByName('SecondFolder')).toEqual(correct);
});

test('returns correct filetree output', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const ffolder = colors.green('FirstFolder.md');
  const root = colors.green('root.md');
  const sfolder = colors.green('SecondFolder.md');
  const ghi = colors.green('GHI.md');

  const correctString = `TestFolders\n|─FirstFolder\n|──GHI\n|───${ghi}\n|──${ffolder}\n|─SecondFolder\n|──${sfolder}\n|─${root}\n`
  expect(controller.tree(filepath).structure.toString()).toBe(correctString);
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
    { level: 3, parent:'GHI', type: 'file', name: 'GHI.md', fullpath: path.join('FirstFolder', 'GHI') },
    { level: 2, parent:'FirstFolder', type: 'file', name: 'FirstFolder.md', fullpath:path.join('FirstFolder') },
    { level: 2, parent:'SecondFolder', type: 'file', name: 'SecondFolder.md', fullpath: path.join('SecondFolder') },
    { level: 1, parent:'TestFolders', type: 'file', name: 'root.md', fullpath: '' }
  ];
  expect(controller.tree(filepath).structure.getFiles()).toEqual(correctArray);
})

test('returns correct file by name', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correct = { level: 2, parent: 'SecondFolder', type: 'file', name: 'SecondFolder.md', fullpath: path.join('SecondFolder') };
  expect(controller.tree(filepath).structure.getFileByName('SecondFolder.md')).toEqual(correct);
});

test('returns correct depth', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(controller.tree(filepath).structure.depth()).toBe(3);
});

test('returns correct subset', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(controller.tree(filepath).structure.subset({ level: 3, parent: 'GHI' })).toEqual([{ level: 3, parent:'GHI', type: 'file', name: 'GHI.md', fullpath: path.join('FirstFolder', 'GHI') }]);
});

test('returns empty set when nothing matches', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(controller.tree(filepath).structure.subset({ level: 3, parent: 'GHU' })).toEqual([]);
});

test('returns empty set when given invalid filter', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  expect(controller.tree(filepath).structure.subset({ level: 3, parents: 'GHU' })).toEqual([]);
});
