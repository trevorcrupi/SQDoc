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

  constructor(cache, tree, cacheEnabled, port) {
    super(app);
    this.app = app;
    this.tree = tree;
    this.project = config.GLOBALS.projectNameTrim;
    this.Cache = cache;
    this.cacheEnabled = cacheEnabled;
    // Set all the express and handlebars stuff
    this.app.use('/css', express.static(system.FileReader.join([__dirname, '..', '..', 'views', 'css'])));
    this.app.engine('handlebars', exphbs());
    this.app.set('view engine', 'handlebars');
    this.app.set('views', system.FileReader.join([__dirname, '..', '..', 'views']));
  }

  build() {    
    this.tree.getTree().forEach((route) => {
      switch(route.type) {
        case 'file':

          if(this.cacheEnabled) {
            const cached = this.cacheFile(route, this.tree.getTreeIndexByName(route.name));
            if(cached.created) {
              console.log('Successfully cached file %s at %s', colors.cyan(route.name), colors.cyan(this.tree.getTreeIndexByName(route.name) + '/cached.handlebars'));
              break;
            }
          }

          this.registerFileRoute(route);            
          break;
        case 'directory':
          this.registerDirectoryRoute(route);
          break;
        default:
          console.log('%s %s', colors.red('Error reading filetree. Could not make a route for type'), colors.red(route.type));
      }
    });

    return this;
  }
  
  
  cacheFile(route, index) {
    if(this.Cache.isCached(route.name)) {
      this.registerCachedFile(route, index);
      return { created: true }
    }
    
    return this.Cache.cache({
      fullPath: [config.ROOT_PATH, route.fullpath, route.name],
      fileInfo: route,
      index: index.toString()
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
