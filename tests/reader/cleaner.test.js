const cleaner = require('../../lib/reader').cleaner;

test('throws invalid error when empty object given', () => {
  expect(() => {
    cleaner({});
  }).toThrow();
});

test('throws invalid error when children are undefined', () => {
  expect(() => {
    cleaner({ stuff: 'test' });
  }).toThrow();
});

test('removes nothing when no duplicates occur', () => {
  const testObject = {children: [{ name: 'test1' },{ name: 'test2' }]};
  expect(cleaner(testObject)).toStrictEqual(testObject);
});

test('removes all children with duplicate names', () => {
  const testObject = {children: [{ name: '.git' },{ name: 'test2' },{ name:'node_modules' }]};
  expect(cleaner(testObject)).toStrictEqual({children: [{ name: 'test2' }]});
});
