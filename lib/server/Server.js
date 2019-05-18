const express = require('express');
const colors  = require('colors');
const config  = require('../../config');
const system  = require('../system');
const exphbs  = require('express-handlebars');

const Router = require('./Router');
const app    = express();

/**
  @class Server
  @description Server class, Server class, does whatever a server class does.
  @param tree: Documentation Tree
  @extends Router class
  @note: This file is ugly rn
  **/

class Server extends Router {

  constructor(tree) {
    super(app);
    this.app = app;
    this.tree = tree;
    this.project = config.GLOBALS.projectNameTrim;
    this.app.engine('handlebars', exphbs());
    this.app.set('view engine', 'handlebars');
  }

  build(isCached, rebuild) {
    this.tree.getTree().forEach((route) => {
      switch(route.type) {
        case 'file':
          this.registerFileRoute(route, isCached, rebuild);
          break;
        case 'directory':
          const root = this.tree.subset({
            name: 'root.md',
            type: 'file',
            level: route.level+1
          });
          if(root.length === 0)
            this.registerDirectoryRoute(route, isCached);
          break;
        default:
          console.log('%s %s', colors.red('Error reading filetree. Could not make a route for type'), colors.red(route.type));
      }
    });

    return this;
  }

  getApp() {
    return this.app;
  }

  serve(port) {
    if(!port) {
      throw new Error('No port was specified.');
    }

    return this.app.listen(port);
  }
}

module.exports = Server;
