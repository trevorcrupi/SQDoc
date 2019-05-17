const express = require('express');
const colors  = require('colors');
const config  = require('../../config');
const system = require('../system');

/**
  @class Server
  @description Server class, Server class, does whatever a server class does.
  @param structure: DocumentationStructure Object
**/

class Server {

  constructor(structure) {
    this.structure = structure;
    this.tree = structure.getTree();
    this.app = express();
    this.reader = system.FileReader;
    this.writer = system.FileWriter;
  }

  register(build) {
    this.tree.forEach((route) => {
      // Create the uri by replacing any forward slashes (for windows) with backslashes, remove '.md'.
      const uri = '/' + route.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');

      // Paths for Filesystem
      const cachePath   = this.reader.join([config.GLOBALS.projectNameTrim, route.name + '.html']);
      const fullPath    = this.reader.join([config.ROOT_PATH, route.fullpath]);

      if(route.type === 'file') {
        if(!this.reader.exists(cachePath) || build) {
            console.log('[FILE CONVERSION] Found markdown file %s, converting contents to HTML file %s...', colors.green(route.name), colors.green(route.name + '.html'));
            try {
              this.writer.cache({
                path: cachePath,
                contents: this.reader.getFileContents(fullPath)
              });
            } catch(err) {
              console.error(colors.red('Error finding the correct file path to store HTML. Try running ' + colors.green('sqdoc init') + ' if you want caching or ' + colors.green('sqdoc serve --no-cache') + ' if you do not.'));
              console.log(colors.cyan('Showing stack trace now. Don\'t freak out on me, you\'re a developer.'));
              console.log(err);
              process.exit(1);
            }
        }
        this.app.get(uri, (req, res) => {
          res.sendFile(this.reader.retrieveFullCachePath(cachePath));
        });
        console.log('[ROUTING] Route registered for %s', colors.green(uri));
      } else {
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
