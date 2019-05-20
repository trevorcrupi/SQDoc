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
    @description Creates a handlebars file in the cache folder :)
    @param cache: JS object with relevant information
    @example cache({ fullPath: [path, to, file], index: i || 'tree.json' })
    @note if 'tree.json' is the index, there will be an additional property with the tree itself.
  **/
  cache(cache) {
    if(cache.index === 'tree.json') {
      return this.create({
        path: this.join([this.projectPath, cache.index]),
        contents: JSON.stringify(cache.tree)
      }, true);
    }

    const path = this.join(cache.fullPath);
    
    // Make the index directory
    if(!this.isCached(cache.index.toString())) {
      this.mkdir(this.join([this.projectPath, cache.index.toString()]));
    }

    const filepath = this.join([this.projectPath, cache.index.toString(), 'cached.handlebars']);
    return this.create({
      path: filepath,
      contents: this.toHTML(this.getFileContents(path))
    });
  }

  /**
    @description Gets the correct file contents
    @param index: number or 'tree.json'
  **/  
  get(index) {
      const path = (index === 'tree.json') 
        ? 'tree.json'
        : this.join([index.toString(), 'cached.handlebars']);

      try {
        return this.getFileContents(
          this.join([this.projectPath, path])
        );
      } catch(err) {
        return { removed: false, err }
      }
  }

  /**
    @description Removes a file or folder from the cache
    @param path: Array path to file
  **/
  remove(file) {
    const filepath = this.join([this.projectPath, file]);
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
        if(file.includes('.')) {
          removedFile = this.remove(file);
        } else {
          removedFile = super.remove({ path: this.projectPath, isDir: true });
        }
        if(!removedFile.removed) {
          return { removed: false, err: removedFile.err };
        }
      });

      const deletion = super.remove({ path: this.projectPath, isDir: true })
      return deletion.removed
        ? deletion
        : { removed: false, err: deletion.err };
    } catch(err) {
      return { removed: false, err };
    }
  }
  
  isCached(name) {
    return this.exists(
      this.join([this.projectPath, name])
    );
  }

  /**
    @description Retrieves full path of a file from the cache
    @param name: The name of the file
  **/
  retrieveFullCachePath() {
    return this.projectPath;
  }
}


module.exports = Cache;
