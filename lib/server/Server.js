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

  constructor(cache, tree, port) {
    super(app);
    this.app = app;
    this.tree = tree;
    this.project = config.GLOBALS.projectNameTrim;
    this.Cache = cache;
    this.app.use('/css', express.static(system.FileReader.join([__dirname, '..', '..', 'views', 'css'])));
    this.app.engine('handlebars', exphbs());
    this.app.set('view engine', 'handlebars');
    this.app.set('views', system.FileReader.join([__dirname, '..', '..', 'views']));
  }

  build() {    
    this.tree.getTree().forEach((route) => {
      switch(route.type) {
        case 'file':
          this.registerFileRoute(route, cacheEnabled, rebuild);
          break;
        case 'directory':
          const root = this.tree.subset({
            name: 'root.md' || 'index.md',
            type: 'file',
            level: route.level+1
          });
          if(root.length !== 0)
            this.registerDirectoryRoute(route, cacheEnabled);
          break;
        default:
          console.log('%s %s', colors.red('Error reading filetree. Could not make a route for type'), colors.red(route.type));
      }
    });

    return this;
  }
  
  cacheFile(route, treeIndex) {
    return this.Cache.cache({
      fullPath: [config.ROOT_PATH, route.fullpath, route.name],
      fileInfo: route,
      index: this.tree.getTreeIndexByName(route.name) 
    });
  }

  getApp() {
    return this.app;
  }

  serve() {
    if(!this.port) {
      this.port = 3001;
    }

    return this.app.listen(this.port);
  }
}

module.exports = Server;
