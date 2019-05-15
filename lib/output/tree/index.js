const dirTree = require('directory-tree');

// Include struture class
const DocumentationStructure = require('./DocumentationStructure');

/*
  Outputs the directory tree
*/
module.exports = (filepath) => {
  const introduction = 'Documentation Structure';

  // Check for bad filepaths
  if(filepath === undefined || filepath === '')
    return { introduction, error: 'filepath not defined' }

  let filetree = dirTree(filepath, {
    extensions: /\md/
  });

  const StructuredTree = new DocumentationStructure(filetree);

  return {
    introduction,
    'complete': StructuredTree.getFullFiletree(filetree),
    'tree': StructuredTree.getTree(),
    'output': StructuredTree.toString(),
  };
}
