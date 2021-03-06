const path    = require('path');
const colors  = require('colors');
const system  = require('../system');
/**
  @class DocumentationStructure
  @description Class that looks at the total filetree and creates the structure for the DOCUMENTATION tree, i.e. only markdown files.
  @param filetree: The uncleaned filetree from directory-tree package
**/

class DocumentationStructure {

  constructor(filetree) {
    this.tree = [];
    this.files = [];
    this.indexed = {};
    this.getOutputStructure(filetree, 0, '', '');
    this.sort();
  }

  /**
    @description Creates the acutal structure of the trees, defined as a recursive function
    @param directory: the current directory being searched
    @param level: what level we are currently at
    @param parent_fullpath: the complete path of the parent element, so we can search for the file later.
    @note The level = 1 ternary operator is to avoid double paths on concatentation, i.e. if it wasn't there and we needed to do:
      system.FileReader.join(process.cwd(), tree.structure.getTreeNodeByName('directory_or_file').fullpath)
      We would get: personal_stuff\RootFolder\RootFolder\other_stuff
      Which is bad. Obviously.
  **/
  getOutputStructure(directory, level, parent, parent_fullpath) {
    // This means it was found in the cache! Just sort and move on - we only want this class for the get methods
    if(directory[0] !== undefined) {
      this.setTree(directory);
      for(let i = 0; i < this.tree.length; i++) {
        const name = this.tree[i].name;
        this.indexed[name] = i;
        this.files[name] = this.tree[i];
      }

      return;
    }
    
    if(directory.type !== 'file') {
      parent_fullpath = system.FileReader.join([parent_fullpath, directory.name]);
    }
    
    const current = {
      level,
      parent,
      type: directory.type,
      name: directory.name,
      fullpath: level === 0 ? '' : parent_fullpath,
    };

    if(!this.tree.includes(current)) {
      this.tree.push(current);
      // Indexing, need to save an index property for getTreeIndexByName() function
      const index = this.tree.indexOf(current);
      this.tree[index].index = index;
      this.indexed[current.name] = index;
    }

    if(current.type !== 'file' && directory.children.length > 0) {
      directory.children = this.sort(directory.children);
      for(let i = 0; i < directory.children.length; i++) {
        this.getOutputStructure(directory.children[i], level+1, current.name, current.fullpath);
      }
    } else {
      this.files[current.name] = current;
    }
  }

  /**
    @description Gets a specific file by its name
    @param name: The name of the necessary file
  **/
  getFileByName(name) {
    if(!name)
      throw new Error('Must give a filename');

    return this.files[name];
  }

  /**
    @description Get array of all files
  **/
  getFiles() {
    return Object.values(this.files);
  }

  /**
    @description Get specific node in the tree by name
    @param name: The name of the specified node
  **/
  getTreeNodeByName(name) {
    if(!name)
      throw new Error('Must give directory name');

    return this.tree[
      this.indexed[name]
    ];
  }

  /**
    @description Finds tree depth using subspace
  **/
  depth() {
    let depth = 0;
    for(let i = 0; i < this.tree.length; i++) {
        if(this.tree[i].level > depth) {
          depth = this.tree[i].level;
        }
    }

    return depth;
  }

  /**
    @description subsets the tree with arbitrary options
    @param options: Javascript object of options/filters
    @note There can only be as many filters as there are object properties on a tree node.
  **/
  subset(options) {
    const filters = Object.keys(options);
    return this.tree.filter((node) => {
      const properties = Object.keys(node);
      let valid = true;
      filters.forEach((filter) => {
        if(!properties.includes(filter) || node[filter] !== options[filter]) {
          valid = false;
        }
      });
      if(valid) return node;
    });
  }
  
  /**
    @description Sets the tree, i like OOP
    @param tree: the sorted filetree
  **/
  setTree(tree) {
    this.tree = tree;
  }

  /**
    @description Get the full tree
  **/
  getTree() {
    return this.tree;
  }
  
  /**
    @description Get the index of a node by name
    @note Since there can be multiple index.md's, we have to do a little extra if that's the name
  **/
  getTreeIndexByName(name, parent) {
    if(name !== 'index.md') {
      return this.indexed[name];
    }

    if(!parent) {
      throw new Error('parent must be specified to find index.md file.');
    }
    
    
    return this.subset({
      name: 'index.md',
      parent: parent
    })[0].index;
  }
  
  /**
    @description Get the full indexed tree
  **/
  getIndexedTree() {
    return this.indexed;
  }

  /**
    @description Sorts the tree so that files come after folders
    @note This may seem arbitrary, but a lot of things depend on struture being the same.
    We want the tree to be a single array for speed (so that any traversal later will be O(n)),
    but we also need to test output, etc. So structure like this matters, and this is the
    method that forces same structure.
  **/
  sort(subtree) {
    let sort = [];

    // Convert any objects to array with one value
    if(!subtree)
      return;

    if(subtree.length === 1){
      sort.push(subtree[0]);
      return sort;
    }

    for(let i = 0; i < subtree.length-1; i++) {
      // Logical expressions, separated for clarity
      const haveSameParents = (subtree[i].parent === subtree[i+1].parent);
      const rightOrder      = (subtree[i].type === 'file' && subtree[i+1].type === 'directory');

      if(haveSameParents && rightOrder) {
        const temp = subtree[i];
        subtree[i] = subtree[i+1];
        subtree[i+1] = temp;
      }

      sort.push(subtree[i]);

      if(i === subtree.length-2 && !sort.includes[subtree[subtree.length-1]]) {
        sort.push(subtree[subtree.length-1]);
      }
    }

    return sort;
  }

  /**
    @description Converts the tree into a console readable format
  **/
  toString() {
    let output = '';
    this.tree.forEach((directory) => {
      // Apply nice padding!
      if(directory.level > 0) {
        let pad = '|─';
        for(let i = 0; i < directory.level-1; i++) {
          pad += '─';
        }
        if(directory.type === 'file') {
          output += pad + colors.green(directory.name) + '\n';
        } else {
          output += pad + directory.name + '\n';
        }
      } else {
        output += directory.name + '\n';
      }
    });

    return output;
  }
}

module.exports = DocumentationStructure;
