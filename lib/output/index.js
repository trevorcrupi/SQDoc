// Output "Controllers"
const greet = require('./greet');
const tree  = require('./tree');
const serve = require('./serve');

exports.controller = {
  tree,
  greet,
  serve
}
