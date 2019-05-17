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
    @description List the contents of a directory
    @param path: Path to the directory
  **/
  getDirectoryContents(path) {
    if(!this.exists(path))
      throw new Error(`File ${path} does not exist`);
    
    try {
      return fs.readdirSync(path);
    } catch(err) {
      throw new Error(err);
    }
  }

  /**
    @description Joins two file paths together, works for any OS
    @param filepath: Array of stuff to stitch together in order
  **/
  join(filepath) {
    if(!Array.isArray(filepath))
      return false;

    return path.join(...filepath);
  }
}

module.exports = FileReader;
