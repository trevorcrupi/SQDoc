const fs     = require('fs');
const marked = require('marked');

const FileWriter = require('./FileWriter');

/**
  @class Cache
  @description Utility class to make writing/reading from the cache easy
  @extends FileWriter
  @note This class is intending for ease of internal use, so method names
  may not be exceptionally clear. Sorry about that.
**/

class Cache extends FileWriter {
  
  constructor(projectNameTrim) {
    super();
    this.project = projectNameTrim;
    this.projectPath = this.join([__dirname, 'cache', this.project]);
  }
  
  /**
    @description Setups the cache for the project by creating folders
  **/
  setup() {
    try {
      const file = this.create({ path: this.projectPath, isDir: true });
      return file.created;
    } catch(err) {
      throw new Error(err);
    }
  }
  
  /**
    @description Creates an HTML file in the cache folder :)
    @param path: Array path to file
  **/
  cache(path) {
    // Filename is the last member of the array
    const filepath = this.join([this.projectPath, path[path.length-1]+'.html']);
    return this.create({ 
      path: filepath, 
      contents: this.toHTML(this.getFileContents(this.join(path)))
    });
  }
  
  /**
    @description Retrieves full path of a file from the cache
    @param name: The name of the file
  **/
  retrieveFullCachePath(name) {
    const path = this.join([this.projectPath, name]);
    return this.exists(path)
      ? path
      : false;
  }
}


module.exports = Cache;