const colors  = require('colors');
const cleaner = require('../../reader').cleaner;

class DocumentationStructure {

  constructor(filetree) {
    this.filetree = cleaner(filetree);
    this.tree = [];
    this.getOutputStructure(this.filetree, 1);
  }

  getOutputStructure(directory, level) {

    const current = {
      level,
      'type': directory.type,
      'name': directory.name
    };

    if(!this.tree.includes(current)) {
      this.tree.push(current);
    }

    if(current.type !== 'file') {
      for(let i = 0; i < directory.children.length; i++) {
        this.getOutputStructure(directory.children[i], level+1);
      }
    }
  }

  getFullFiletree() {
    return this.filetree;
  }

  getTree() {
    return this.tree;
  }

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
        output += colors.red(directory.name) + '\n';
      }
    });

    return output;
  }
}

module.exports = DocumentationStructure;
