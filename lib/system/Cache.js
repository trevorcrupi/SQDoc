const fs     = require('fs');
const marked = require('marked');
const colors = require('colors');

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
  cache(filePathArray) {
    const path = this.join(filePathArray);
    
    if(!this.exists(path))
      return { created: false };

    // Filename is the last member of the array
    const filepath = this.join([this.projectPath, filePathArray[filePathArray.length-1]+'.html']);
    return this.create({
      path: filepath, 
      contents: this.toHTML(this.getFileContents(path))
    });
  }

  /**
    @description Removes a file from the cache
    @param path: Array path to file
  **/
  remove(path) {
    const filepath = this.join([this.projectPath, path]);
    return super.remove({ path: filepath });
  }

  /**
    @description Deletes project directory
  **/
  delete() {
    if(!this.exists(this.projectPath)) {
      return { removed: false, err: 'Project does not exist' };
    }
    
    try {
      const files = this.getDirectoryContents(this.projectPath);
      let removedFile = {};
      files.forEach((file) => {
        removedFile = this.remove(file);
        if(!removedFile.removed) 
          throw new Error(removedFile.err);
      });

      const deletion = super.remove({ path: this.projectPath, isDir: true })
      return deletion.removed
        ? deletion
        : { removed: false, err: deletion.err };
    } catch(err) {
      return { 
        removed: false,
        err 
      };
    }
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