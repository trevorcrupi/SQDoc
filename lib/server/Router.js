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

  registerFileRoute(route, isCached, rebuild) {
    const indexFiles = [
      'root.md',
      'index.md'
    ];
    const cachePath    = system.Cache(this.project).retrieveFullCachePath(route.name);
    const shouldCache  = isCached && (!system.FileReader.exists(cachePath) || rebuild);
    let uri = '/' + system.FileReader.join([route.fullpath, route.name]).replace(/\\/g, '/').replace(/.md/g, '/');

    if(indexFiles.includes(route.name)) {
      uri = '/' + route.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');
    }

    if(shouldCache) {
      this.cache(route);
    }

    this.app.get(uri, (req, res) => {
      try {
        console.log(`Accessed ${uri}`);
        if(isCached) {
          res.render(cachePath, {
            globals: config.GLOBALS,
          });
        } else {
          res.render('layouts/main', {
            globals: config.GLOBALS,
            body: system.FileWriter.toHTML(system.FileReader.getFileContents(
              system.FileReader.join([route.fullpath, route.name])
            ))
          });
        }
      } catch(err) {
        console.error(colors.red('Error creating route.'));
        console.log(colors.red('Showing stack trace. Don\'t quit on me now, you\'re a developer.'));
        console.log(err);
      }
    });

    console.log('[ROUTING] Route registered for %s', colors.green(uri));
  }

  registerDirectoryRoute(route, isCached) {
    const uri = '/' + route.fullpath.replace(/\\/g, '/');
    console.log('[ROUTING] Route registered for %s', colors.green(uri));
    this.app.get(uri, (req, res) => {
      res.render('layouts/main', {
        globals: config.GLOBALS,
        body: '<h1>This is a directory</h1><br />' + route.name
      });
    });
  }

  cache(route) {
    console.log('[CACHE] Found uncached markdown file %s, converting contents to handlebars file %s...', colors.green(route.name), colors.green(route.name + '.handlebars'));
    try {
      const cached = system.Cache(this.project).cache([config.ROOT_PATH, route.fullpath, route.name]);
      if(!cached.created) {
        throw new Error(cached.err);
      }
      console.log('%s', colors.cyan('File was cached, all systems go!'));
    } catch(err) {
      console.error(colors.red('Error finding the correct file path to store HTML. Try running ' + colors.green('sqdoc init') + ' if you want caching or ' + colors.green('sqdoc serve --no-cache') + ' if you do not.'));
      console.log(colors.red('Showing stack trace. Don\'t quit on me now, you\'re a developer.'));
      console.log(err);
    }
  }
}

module.exports = Router;
