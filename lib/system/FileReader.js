const fs   = require('fs');
const path = require('path');

/**
  @class FileReader
  @description Utility class to make reading/traversing the FileSystem easy af
**/

class FileReader {

  /**
    @description Checks if a file exists in the fileSystem
    @param path: Path to the file
  **/
  exists(path) {
    try {
      return fs.existsSync(path);
    } catch(err) {
      console.error(
        'Something went horribly wrong trying to check file: %s',
        path
      );
      console.error(
        'Error: %s',
        err
      );
      return false;
    }
  }

  /**
    @description Gets the contents of a file by a pathname
    @param path: Path to the file
  **/
  getFileContents(path) {
    if(!this.exists(path))
      throw new Error('Error getting the file contents from file: ' + path);

    try {
      return fs.readFileSync(path, 'utf8');
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Joins two file paths together, works for any OS
    @param partA: The first half of the path to stitch together
    @param partB: The second half of the path to stitch together
  **/
  join(partA, partB) {
    return path.join(partA, partB);
  }

  /**
    @description Retrieves full path of a file from the cache
    @param name: The name of the file
  **/
  retrieveFullCachePath(name) {
    const cachePath = this.join(__dirname, 'cache/' + name);
    return this.exists(cachePath)
      ? cachePath
      : false;
  }
}

module.exports = FileReader;
