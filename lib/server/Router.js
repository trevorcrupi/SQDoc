const colors  = require('colors');
const config  = require('../../config');
const system  = require('../system');

/**
  @class Router
  @description Router class, makes routing infinitely easier adn cleaner
  @param app: Express App
**/
class Router {

  constructor(app, project) {
    this.app = app;
    this.project = project;
  }

  registerFileRoute(route) {
    const uri = this.getURI(route);
    this.app.get(uri, (req, res) => {
      try {
        res.render('layouts/main', {
          globals: config.GLOBALS,
          route: route,
          body: system.FileWriter.toHTML(system.FileReader.getFileContents(
            system.FileReader.join([route.fullpath, route.name])
          ))
        });
      } catch(err) {
        console.error(colors.red('Error creating route.'));
        console.log(colors.red('Showing stack trace. Don\'t quit on me now, you\'re a developer.'));
        console.log(err);
      }
    });

    console.log('[ROUTING] Route registered for %s', colors.green(uri));
  }

  registerDirectoryRoute(route) {
    const uri = this.getURI(route);
    this.app.get(uri, (req, res) => {
      res.render('layouts/main', {
        globals: config.GLOBALS,
        body: '<h1>This is a directory</h1><br />' + route.name
      });
    });
    console.log('[ROUTING] Route registered for cached file %s', colors.green(uri));    
  }

  registerCachedFile(route, index, cache) {
    const uri = this.getURI(route);
    const cachePath = system.FileReader.join([cache.retrieveFullCachePath(), index, 'cached.handlebars']);
    this.app.get(uri, (req, res) => {
      try {
        res.render(cachePath, {
          globals: config.GLOBALS,
          route: route
        });
      } catch(err) {
        console.error(colors.red('Error creating cached route.'));
        console.log(colors.red('Showing stack trace. Don\'t quit on me now, you\'re a developer.'));
        console.log(err);
      }
    });

    console.log('[ROUTING] Route registered for cached file %s', colors.green(uri));    
  }
  
  getURI(route) {
    let uri = '';
    const indexFiles = [
      'index.md'
    ];
    
    if(route.type === 'directory') {
      return '/' + route.fullpath.replace(/\\/g, '/');
    }
    
    // Create the URI
    uri = '/' + system.FileReader.join([route.fullpath, route.name]).replace(/\\/g, '/').replace(/.md/g, '/');
    if(indexFiles.includes(route.name)) {
      uri = '/' + route.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');
    }
    
    return uri;
  }
}

module.exports = Router;
