#!/usr/bin/env node
const path    = require('path');
const colors  = require('colors');
const dirTree = require('directory-tree');
const cleaner = require('../lib/reader').cleaner;

const filetree = dirTree(process.cwd(), {
  extensions: /\md/
});

console.log(
  cleaner(filetree)
);
