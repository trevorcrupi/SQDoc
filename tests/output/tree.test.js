const path       = require('path');
const controller = require('../../lib/output').controller;
const dirTree    = require('directory-tree');
const cleaner    = require('../../lib/reader').cleaner;

test('returns correct introduction', () => {
  expect(controller.tree().introduction).toBe('Documentation Structure');
});

test('returns correct filetree', () => {
  const filepath = path.join(__dirname, 'TestFolders');
  const correctFiletree = dirTree(filepath, {
    extensions: /\md/
  });
  expect(controller.tree(filepath).complete).toStrictEqual(cleaner(correctFiletree));
});
