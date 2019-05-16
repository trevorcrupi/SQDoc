const express = require('express');
const colors  = require('colors');
const config  = require('../../config');
const system = require('../system');

/**
  @description Server class, Server class, does whatever a server class does.
  @class Server
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
      const uri = '/' + route.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');
      const cachePath = this.reader.getCachePath(route.name);
      const fullPath  = this.reader.join(config.ROOT_PATH, route.fullpath);

      if(route.type === 'file') {
        if(!this.reader.exists(cachePath) || build) {
            console.log('[FILE CONVERSION] Found markdown file %s, converting contents to HTML file %s...', colors.green(route.name), colors.green(route.name + '.html'));
            this.writer.cache(
              cachePath,
              this.reader.getFileContents(fullPath)
            );
        }
        this.app.get(uri, (req, res) => {
          res.sendFile(this.reader.getCachePath(route.name));
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
