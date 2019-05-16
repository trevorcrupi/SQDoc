const path    = require('path');
const colors  = require('colors');
const cleaner = require('../../reader').cleaner;

/**
  @class DocumentationStructure
  @description Class that looks at the total filetree and creates the structure for the DOCUMENTATION tree, i.e. only markdown files.
  @param filetree: The uncleaned filetree from directory-tree package
**/

class DocumentationStructure {

  constructor(filetree) {
    this.filetree = cleaner(filetree);
    this.tree = [];
    this.files = [];
    this.indexed = {};
    this.getOutputStructure(this.filetree, 0, '');
    this.sort();
  }

  /**
    @description Creates the acutal structure of the trees, defined as a recursive function
    @param directory: the current directory being searched
    @param level: what level we are currently at
    @param parent_fullpath: the complete path of the parent element, so we can search for the file later.
    @note The level = 1 ternary operator is to avoid double paths on concatentation, i.e. if it wasn't there and we needed to do:
      path.join(process.cwd(), tree.structure.getTreeNodeByName('directory_or_file').fullpath)
      We would get: personal_stuff\RootFolder\RootFolder\other_stuff
      Which is bad. Obviously.
  **/
  getOutputStructure(directory, level, parent, parent_fullpath) {

    const current = {
      level,
      parent,
      'type': directory.type,
      'name': directory.name,
      'fullpath': level === 0 ? '' : path.join(parent_fullpath, directory.name)
    };

    if(!this.tree.includes(current)) {
      this.tree.push(current);
      this.indexed[current.name] = this.tree.indexOf(current);
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
    @description Subspaces the tree with arbitrary options
    @param options: Javascript object of options/filters
    @note There can only be as many filters as there are object properties on a tree node.
  **/
  subspace(options) {
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
    @description Get the full tree
  **/
  getTree() {
    return this.tree;
  }

  /**
    @description Get the full filetree with metadata
  **/
  getFullFiletree() {
    return this.filetree;
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
        sort.push(subtree[i]);
        sort.push(subtree[i+1]);
      } else {
        sort.push(subtree[i]);
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
