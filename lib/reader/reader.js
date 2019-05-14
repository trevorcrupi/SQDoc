
const cleaner = function(filetree) {
  if(filetree === undefined || filetree.children === undefined)
    throw new Error('Invalid directory.');

  if(Object.entries(filetree).length === 0)
    throw new Error('Invalid directory');

  if(filetree.children.length > 0)
    filetree.children = removeNodes(filetree, ['.git', 'tests', 'node_modules']);

  return filetree;
}

const removeNodes = function(filetree, nodes) {
  // Compare children to nodes and remove duplicates
  return filetree.children.filter((child) => {
    if(!nodes.includes(child.name))
      return child;
  });
}

exports.cleaner = cleaner;
