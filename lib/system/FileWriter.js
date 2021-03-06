const fs     = require('fs');
const marked = require('marked');
const mkDir  = require('make-dir');

const FileReader = require('./FileReader');

/**
  @class FileWriter
  @description Utility class to make writing to the FileSystem easy af
  @extends FileReader
  @note At first glance, it might seem odd to have FileWriter extend FileReader, and I thought
  this at first also. However, if you think about it, it only seems odd for semantic reasons. It
  makes perfect sense for a FileWriter class to be able to read files, check if they exist, etc.
**/

class FileWriter extends FileReader {

  constructor() {
    super();
  }

  /**
    @description Creates a file if given stuff to put in it
    @param file: object with information about the file
    @example: { path: 'path-to-file', contents: 'file contents', isDir: false }
  **/
  create(file, overwrite = false) {
    if(!file || !file.path) {
      return {
        created: false,
        err: 'Invalid object given to create'
      }
    }
    try {
      const created = true;

      if(!this.exists(file.path) || overwrite) {
        file.isDir
          ? this.mkdir(file.path)
          : fs.writeFileSync(file.path, file.contents);

        return {
          created,
          path: file.path,
          contents: file.contents !== undefined ? file.contents : null
        };
      }

      return {
        created: !created,
        err: 'File already exists!'
      };
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Creates a directory at a given path
    @param path: Path to the directory
  **/
  mkdir(path) {
    try {
      mkDir.sync(path, { force: true });
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Removes a file given a path
    @param file: Javascript object representing the file to delete
    @example: { path: 'path/to/file', isDir: true }
  **/
  remove(file) {
    if(!file || !file.path) {
      return {
        removed: false,
        err: 'Invalid object given to create'
      }
    }

    try {
      const removed = true;
      if(this.exists(file.path)) {
        file.isDir
          ? fs.rmdirSync(file.path, { recursive: true })
          : fs.unlinkSync(file.path);

        return {
          removed,
          path: file.path
        };
      }

      return {
        removed: !removed,
        err: 'File doesn\'t exist, ' + file.path
      };
    } catch(err) {
      return { removed: false, err };
    }
  }

  /**
    @description Converts the markdown contents to HTML on the fly
    @param contents: Markdown contents
  **/
  toHTML(contents) {
    return marked(contents);
  }
}

module.exports = FileWriter;
