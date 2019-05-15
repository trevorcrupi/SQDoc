const controller = require('../../lib/output').controller;

test('returns Hello, World!', () => {
  expect(controller.greet()).toBe('Hello, World!');
});
