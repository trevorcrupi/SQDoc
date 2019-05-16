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
    this.getOutputStructure(this.filetree, 1, '');
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
  getOutputStructure(directory, level, parent_fullpath) {

    const current = {
      level,
      'type': directory.type,
      'name': directory.name,
      'fullpath': level === 1 ? '' : path.join(parent_fullpath, directory.name)
    };

    if(!this.tree.includes(current)) {
      this.tree.push(current);
      this.indexed[current.name] = this.tree.indexOf(current);
    }

    if(current.type !== 'file') {
      for(let i = 0; i < directory.children.length; i++) {
        this.getOutputStructure(directory.children[i], level+1, current.fullpath);
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
    @description Converts the tree into a console readable format
  **/
  toString() {
    let output = '';
    this.tree.forEach((directory) => {
      // Apply nice padding!
      if(directory.level > 1) {
        let pad = ' |';
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
