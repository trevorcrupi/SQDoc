 const express = require('express');
const colors  = require('colors');
const config  = require('../../config');
const system  = require('../system');
const exphbs  = require('express-handlebars');

const Router = require('./Router');
const app    = express();

/**
  @class Server
  @description Server class: Everything that has to do with servers
  @param tree: Documentation Tree
  @extends Router class
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
    this.app.use('/assets', express.static(system.FileReader.join([__dirname, '..', '..', 'views', 'assets'])));
    this.app.engine('handlebars', exphbs( { 
      extname: 'handlebars', 
      defaultLayout: 'main', 
      layoutsDir: system.FileReader.join([__dirname, '..', '..', 'views', 'layouts']),
      partialsDir: system.FileReader.join([__dirname, '..', '..', 'views', 'layouts', 'partials'])
    }));
    this.app.set('view engine', 'handlebars');
    this.app.set('views', system.FileReader.join([__dirname, '..', '..', 'views']));
  }

  build() {    
    this.tree.getTree().forEach((route) => {
      switch(route.type) {
        case 'file':

          if(this.cacheEnabled) {
            const cached = this.cacheFile(route, this.tree.getTreeIndexByName(route.name, route.parent));
            if(cached.created) {
              console.log('Successfully cached file %s at %s', colors.cyan(route.name), colors.cyan(this.tree.getTreeIndexByName(route.name, route.parent) + '/cached.handlebars'));
              this.registerCachedFile(route, this.tree.getTreeIndexByName(route.name, route.parent).toString(), this.Cache, this.tree);
              break;
            }
          }

          this.registerFileRoute(route, this.tree);
          break;
        case 'directory':
          const index = this.tree.subset({ name: 'index.md', parent: route.name });
          if(index.length === 0) {
            this.registerDirectoryRoute(route, this.tree);
          }

          break;
        default:
          console.log('%s %s', colors.red('Error reading filetree. Could not make a route for type'), colors.red(route.type));
      }
    });

    return this;
  }
  
  
  cacheFile(route, index) {
    if(this.Cache.isCached(route.name)) {
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
