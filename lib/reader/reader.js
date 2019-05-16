const blacklist = require('../../config').blacklisted;
const colors    = require('colors');
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
  console.log('%s', colors.cyan('Removing unnecessary folders...'));
  return filetree.children.filter((child) => {
    if(!nodes.includes(child.name))
      return child;
  });
}

exports.cleaner = cleaner;
