const fs     = require('fs');
const marked = require('marked');

const FileReader = require('./FileReader');
/**
  @class FileWriter
  @description Utility class to make writing to the FileSystem easy af
  @extends FileReader, needs ability to Traverse fileSystem
**/

class FileWriter extends FileReader {

  constructor() {
    super();
  }

  /**
    @description Creates a file if given stuff to put in it
    @param path: Path to the file
    @param contents: Contents to go in the file
  **/
  create(path, contents) {
    try {
      if(!this.exists(path))
        fs.writeFileSync(path, contents);
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Creates a directory at a given path
    @param dir: Path to the directory
  **/
  mkdir(dir) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Converts the markdown contents to HTML on the fly
    @param contents: Markdown contents
  **/
  toHTML(contents) {
    return marked(contents);
  }

  // TODO: Make separate cache class?

  /**
    @description Setups the cache for the project by creating
    @param folderName: Name of the project trimmed that will be created in the cache folder.
  **/
  setupCache(folderName) {
    const cachePath = this.join(__dirname, folderName);
    // Don't do anything if it exists already
    if(this.exists(cachePath)) {
      return;
    }
    
    try {
      this.mkdir(cachePath);
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Creates an HTML file in the cache folder :)
    @param cachePath: projectNameTrimmed/name_of_file.md.html
    @param contents: contents of the markdown file.
  **/
  cache(cachePath, contents) {
    const loc = this.join(__dirname, 'cache/' + cachePath);
    this.create(loc, this.toHTML(contents));
  }
}

module.exports = FileWriter;
