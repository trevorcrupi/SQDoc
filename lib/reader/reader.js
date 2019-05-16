const blacklist = require('../../config').blacklisted;

/**
  @description Removes any folders we know we wont need (.git, node_modules, etc)
  @param filetree: The uncleaned filetree from directory-tree package
**/
const cleaner = (filetree) => {
  if(filetree === undefined || filetree.children === undefined)
    throw new Error('Invalid directory.');

  if(Object.entries(filetree).length === 0)
    throw new Error('Invalid directory');

  if(filetree.children.length > 0)
    filetree.children = removeNodes(filetree, blacklist);

  return filetree;
}

/**
  @description Does the Actual Removal
  @param filetree: The uncleaned filetree from directory-tree package
  @param nodes: The blacklisted directories
  @note This is the most beautiful method I've ever written.
**/
const removeNodes = (filetree, nodes) => {
  // Compare children to nodes and remove duplicates
  return filetree.children.filter((child) => {
    if(!nodes.includes(child.name))
      return child;
  });
}

/**
  @description Sorts tree so that files come after directories
  @param filetree: The cleaned filetree from directory-tree package
**/
const sort = (filetree) => {
  for(let i = 0; i < filetree.length-1; i++) {
    if(filetree[i].type === 'file' && filetree[i+1].type === 'directory') {
      // do the dirty #swap
      const temp = filetree[i];
      filetree[i] = filetree[i+1];
      filetree[i+1] = temp;
    }
  }
    
  return filetree;
}

exports.cleaner = cleaner;
