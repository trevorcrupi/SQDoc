#!/usr/bin/env node
const fs = require('fs');
const program  = require('commander');
const colors   = require('colors');
const init     = require('./init');
const config   = require('../config');
const system   = require('../lib/system');

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
    @description Runs init function at anytime (can override lock file!)
    @command: 'init'
    @params: N/A
  **/
  program
    .command('init')
    .description('Generates doc.lock file')
    .action(() => {
      init();
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
    if(system.FileReader.exists(config.LOCK_PATH)) {
      const tree = controller.tree(config.ROOT_PATH);
      console.log('Command: %s', tree.introduction);
      console.log('---------------');

      if(!system.FileReader.exists(config.LOCK_PATH)) {
        init();
      }

      if(!tree.complete) {
        console.error('%s', tree.error || 'Something went wrong!');
        throw new Error();
      }

      console.log(tree.output);
    } else {
      console.log(colors.red('No doc.lock file yet.'), colors.green('sqdoc'));
    }
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
    if(system.FileReader.exists(config.LOCK_PATH)) {
      const tree = controller.tree(config.ROOT_PATH);
      // Get contents of lock file
      const globals = JSON.parse(system.FileReader.getFileContents(config.LOCK_PATH));

      try {
        const server = new Server(tree.structure, globals);
        server.register(args.build)
              .serve(args.port);
        console.log('Documentation server is up and running on port %s', colors.green(args.port));
      } catch(err) {
        throw new Error(err);
      }
    } else {
      console.log(colors.red('No doc.lock file yet.'), colors.green('sqdoc'));
    }
  });

program.parse(process.argv);

if(!system.FileReader.exists(config.LOCK_PATH)) {
  init();
}
