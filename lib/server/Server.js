const express = require('express');
const colors  = require('colors');
const config  = require('../../config');
const system  = require('../system');
const exphbs  = require('express-handlebars');

/**
  @class Server
  @description Server class, Server class, does whatever a server class does.
  @param structure: DocumentationStructure Object
  @note: This file is ugly rn
**/

class Server {

  constructor(structure) {
    this.structure = structure;
    this.tree = structure.getTree();
    this.app = express();
    this.reader  = system.FileReader;
    this.writer  = system.FileWriter;
    this.project = config.GLOBALS.projectNameTrim;
    this.app.engine('handlebars', exphbs());
    this.app.set('view engine', 'handlebars');
  }

  register(build) {
    this.tree.forEach((route) => {
      // Create the uri by replacing any forward slashes (for windows) with backslashes, remove '.md'.
      let uri = '';
      if(route.type === 'file') {
        uri = '/' + this.reader.join([route.fullpath, route.name]).replace(/\\/g, '/').replace(/.md/g, '/');
        const cachePath = system.Cache(this.project).retrieveFullCachePath(route.name);

        if(!this.reader.exists(cachePath) || build) {
            console.log('[FILE CONVERSION] Found markdown file %s, converting contents to HTML file %s...', colors.green(route.name), colors.green(route.name + '.html'));
            try {
              const cached = system.Cache(this.project).cache([config.ROOT_PATH, route.fullpath, route.name]);
              if(!cached.created) {
                throw new Error(cached.err);
              }
              console.log('%s', colors.cyan('File was cached, all systems go!'));
            } catch(err) {
              console.error(colors.red('Error finding the correct file path to store HTML. Try running ' + colors.green('sqdoc init') + ' if you want caching or ' + colors.green('sqdoc serve --no-cache') + ' if you do not.'));
              console.log(colors.red('Showing stack trace now. Don\'t freak out on me, you\'re a developer.'));
              console.log(err);
              process.exit(1);
            }
        }
        this.app.get(uri, (req, res) => {
          res.render(cachePath);
        });
        console.log('[ROUTING] Route registered for %s', colors.green(uri));
      } else {
        uri = '/' + route.fullpath.replace(/\\/g, '/');
        console.log('[ROUTING] Route registered for %s', colors.green(uri));
        this.app.get(uri, (req, res) => {
          res.send('No file here. But you might be close. Name: ' + route.name);
        });
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
