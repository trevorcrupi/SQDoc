#!/usr/bin/env node
const path    = require('path');
const program = require('commander');
const colors  = require('colors');

// Import controllers
const controller = require('../lib/output').controller;

// Get the f*kin app server!
const Server = require('../lib/server').Server;

/**
  @description Simple greet program for testing and fun
  @command: 'greet'
  @params: N/A
**/
program
  .command('greet')
  .description('Gives a nice greeting')
  .action(() => {
    console.log('%s', colors.red(controller.greet()));
  });

/**
  @description Lists the documentation tree (so folders and markdown) in nice format
  @command: 'tree'
  @params: N/A
**/
program
  .command('tree')
  .alias('t')
  .description('Show documentation tree')
  .action(() => {
    const tree = controller.tree(process.cwd());
    console.log('Command: %s', tree.introduction);
    console.log('---------------');

    if(!tree.complete) {
      console.error('%s', tree.error || 'Something went wrong!');
      throw new Error();
    }

    console.log(tree.output);
  });

/**
  @description Starts and opens the server for the markdown documentation static site
  @command: 'serve'
  @params: 'port'
**/
program
  .command('serve')
  .alias('p')
  .description('Starts the documentation server')
  .option('-p, --port [value]', 'Port', "3001")
  .option('-b, --build', 'Build Static Files', "")
  .action((args) => {
    const ref = process.cwd();
    const tree = controller.tree(ref);

    try {
      const server = new Server(tree.structure, ref);
      server.register(args.build)
            .serve(args.port);
      console.log('Documentation server is up and running on port %s', colors.green(args.port));
    } catch(err) {
      throw new Error(err);
    }
  });

program.parse(process.argv)
