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

  registerFileRoute(route, tree) {
    const uri = this.getURI(route);
    const filePathArray = uri.split('/');
    let breadcrumbs = [];
    for(let i = 0; i < filePathArray.length; i++) {
      if(filePathArray[i]) {
        breadcrumbs.push(tree.getTreeNodeByName(filePathArray[i]));
      }
    }
    
    this.app.get('/' + uri, (req, res) => {
      try {
        res.render('layouts/main', {
          globals: config.GLOBALS,
          route: route,
          body: system.FileWriter.toHTML(system.FileReader.getFileContents(
            system.FileReader.join([route.fullpath, route.name])
          )),
          breadcrumbs: uri.split('/'),
          toc: this.getFullTableOfContents(tree),
        });
      } catch(err) {
        console.error(colors.red('Error creating route.'));
        console.log(colors.red('Showing stack trace. Don\'t quit on me now, you\'re a developer.'));
        console.log(err);
      }
    });

    console.log('[ROUTING] Route registered for cached file %s', colors.green(uri));
  }

  registerDirectoryRoute(route, tree) {
    const uri = this.getURI(route);
    
    const tocString = this.getTableOfContents(route, tree);
    
    const filePathArray = uri.split('/');
    let breadcrumbs = [];
    for(let i = 0; i < filePathArray.length; i++) {
      if(filePathArray[i]) {
        breadcrumbs.push(tree.getTreeNodeByName(filePathArray[i]));
      }
    }
    
    this.app.get('/' + uri, (req, res) => {
      res.render('layouts/directory', {
        globals: config.GLOBALS,
        route: route,
        tocString,
        breadcrumbs,
      });
    });
    console.log('[ROUTING] Route registered for directory %s', colors.green(uri));    
  }

  registerCachedFile(route, index, cache, tree) {
    const uri = this.getURI(route);
    const cachePath = system.FileReader.join([cache.retrieveFullCachePath(), index, 'cached.handlebars']);
    const filePathArray = uri.split('/');
    let breadcrumbs = [];
    for(let i = 0; i < filePathArray.length; i++) {
      if(filePathArray[i]) {
        breadcrumbs.push(tree.getTreeNodeByName(filePathArray[i]));
      }
    }
    
    this.app.get('/' + uri, (req, res) => {
      try {
        res.render(cachePath, {
          globals: config.GLOBALS,
          route: route,
          breadcrumbs,
          toc: this.getFullTableOfContents(tree),
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
      return route.fullpath.replace(/\\/g, '/');
    }
    
    // Create the URI
    uri = system.FileReader.join([route.fullpath, route.name]).replace(/\\/g, '/').replace(/.md/g, '/');
    if(indexFiles.includes(route.name)) {
      uri = route.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');
    }
    
    return uri;
  }
  
  getFullTableOfContents(tree) {
    let tocString = '<ul id="table-of-contents">';
    tree.getTree().forEach((node) => {
      let linkClass = 'directory';
      let displayName = node.name;
      tocString += '<li>';
      for(let i = 0; i < node.level; i++) {
        tocString += '─';
      }
      let nodeURI = node.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');
      if(node.type === 'file' && node.name !== 'index.md') {
          nodeURI = nodeURI + '/' + node.name.replace(/.md/g, '/');
      }
      
      if(node.type === 'file' || node.name === 'index.md') {
        linkClass = 'file';
      }
      
      if(node.level > 2) {
        displayName = node.parent + '/' + node.name;
      }
      
      if(nodeURI[0] === '/') {
        tocString += '<a class=' + linkClass + ' href=' + nodeURI + '>' + displayName + '</a></li>';             
      } else {
        tocString += '<a class=' + linkClass + ' href=/' + nodeURI + '>' + displayName + '</a></li>';
      }

      return node;
    });
    
    tocString += '</ul>'
    
    return tocString;
  }
  
  getTableOfContents(route, tree) {
    let tocString = '<ul id="table-of-contents">';
    const toc = tree.getTree().filter((node) => {
      if(node.parent === route.name || node.name === route.name) {
        let linkClass = 'directory';
        let displayName = node.name;
        tocString += '<li>';
        for(let i = 0; i < node.level; i++) {
          tocString += '─';
        }
        let nodeURI = node.fullpath.replace(/\\/g, '/').replace(/.md/g, '/');
        if(node.type === 'file' && node.name !== 'index.md') {
            nodeURI = nodeURI + '/' + node.name.replace(/.md/g, '/');
        }
        
        if(node.type === 'file' || node.name === 'index.md') {
          linkClass = 'file';
        }
        
        if(node.level > 2) {
          displayName = node.parent + '/' + node.name;
        }
        
        if(nodeURI[0] === '/') {
          tocString += '<a class=' + linkClass + ' href=' + nodeURI + '>' + displayName + '</a></li>';             
        } else {
          tocString += '<a class=' + linkClass + ' href=/' + nodeURI + '>' + displayName + '</a></li>';
        }
        
        return node;
      }
    });
    tocString += '</ul>'
    
    return tocString.length === 1
      ? 'No Children. <a href='/'>Go Home</a>'
      : tocString;
  }
}

module.exports = Router;
