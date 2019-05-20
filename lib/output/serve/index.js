const config  = require('../../../config');
const system  = require('../../system');
const reader  = require('../../reader').reader;
const Server  = require('../../server').Server;

const DocumentationStructure = require('../../reader').DocumentationStructure;

/*
  Returns tree (with caching) and server object
*/
module.exports = (args, cacheEnabled) => {
  // Get caching information and fileTree
  const shouldCache = args.cache || cacheEnabled;
  const Cache = system.Cache(config.GLOBALS.projectNameTrim);
  const fileTree = reader.getFileTree(shouldCache, args.build, Cache);

  // Get a structured tree
  const StructuredTree = new DocumentationStructure(fileTree.fileTree);
  const tree = StructuredTree.getTree();

  if(!fileTree.isCached && shouldCache) {
    const cached = Cache.cache({
      index: 'tree.json',
      tree
    });
    
    if(!cached.created) {
      throw new Error(cached.err);
    }
  }

  return {
    Server: new Server(Cache, StructuredTree, shouldCache, args.port || 3001)
  };
}