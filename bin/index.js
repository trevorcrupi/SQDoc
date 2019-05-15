#!/usr/bin/env node
const path    = require('path');
const program = require('commander');
const colors  = require('colors');

const controller = require('../lib/output').controller;

/*
  Simple greet program for testing and fun
  @command: 'greet'
  @params: N/A
*/
program
  .command('greet')
  .description('Give a nice greeting')
  .action(() => {
    console.log('%s', colors.red(controller.greet()));
  });

/*
  Lists the documentation tree (so folders and markdown) in nice format
  @command: 'tree'
  @params: N/A
*/
program
  .command('tree')
  .alias('t')
  .description('Show documentation tree')
  .action(() => {
    const tree = controller.tree(process.cwd());
    console.log('Command: %s', tree.introduction);
    console.log('---------------');

    if(tree.complete === undefined) {
      console.error('%s', tree.error || 'Something went wrong!');
      throw new Error();
    }

    console.log(tree.tree);
  });

program.parse(process.argv)
