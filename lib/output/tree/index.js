const config  = require('../../../config');
const system  = require('../../system');
const reader  = require('../../reader').reader;

const DocumentationStructure = require('../../reader').DocumentationStructure;

/*
  Outputs the directory tree
*/
module.exports = (cacheEnabled) => {
  const introduction = 'Documentation Structure';
  
  // Check if caching was enabled
  const Cache = system.Cache(config.GLOBALS.projectNameTrim);
  const fileTree = reader.getFileTree(cacheEnabled, false, Cache);
  
  return {
    introduction,
    structure: new DocumentationStructure(fileTree.fileTree)
  };
}
