const config    = require('../../config');
const blacklist = require('../../config').blacklisted;
const dirTree   = require('directory-tree');

/**
  @description Gets the whole filetree
  @param cacheEnabled: whether or not cache was enabled
  @param cache: Cache object
**/
const getFileTree = (cacheEnabled, rebuild, cache) => {
  let isCached = false;

  if(rebuild) {
    const deleted = cache.delete();
    cache.setup();
  }

  if(cacheEnabled) {
    isCached = cache.isCached('tree.json');
  }

  if(!isCached) {
    const fileTree = cleaner(dirTree(config.ROOT_PATH, {
      extensions: /\md/
    }));

    return { fileTree, isCached };
  }

  return {
    fileTree: JSON.parse(cache.get('tree.json')),
    isCached: isCached
  }
}

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
    // console.log(child);
    if(!nodes.includes(child.name))
      return child;
  });
}

exports.getFileTree = getFileTree;
