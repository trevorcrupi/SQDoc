const dirTree = require('directory-tree');
const colors  = require('colors');
// Include struture class
const DocumentationStructure = require('./DocumentationStructure');

/*
  Outputs the directory tree
*/
module.exports = (filepath) => {
  const introduction = 'Documentation Structure';

  // Check for bad filepaths
  if(!filepath)
    return { introduction, error: 'filepath not defined' }
  
  console.log('%s', colors.cyan('Scanning the filetree...'));
  let filetree = dirTree(filepath, {
    extensions: /\md/
  });
  console.log('%s', colors.cyan('Got the filetree.'));
  const StructuredTree = new DocumentationStructure(filetree);

  return {
    introduction,
    'structure': StructuredTree,
    'complete': StructuredTree.getFullFiletree(filetree),
    'output': StructuredTree.toString(),
  };
}
