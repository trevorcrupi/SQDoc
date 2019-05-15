const fs   = require('fs');
const path = require('path');

class FileReader {
  getFileContents(path) {
    return fs.readFileSync(path, 'utf8');
  }

  exists(path) {
    try {
      return fs.existsSync(path);
    } catch(err) {
      throw new Error(err);
    }
  }

  getCachePath(filename) {
    return this.join(
      __dirname,
      this.join('cache', filename + '.html')
    );
  }

  join(fileA, fileB) {
    return path.join(fileA, fileB);
  }
}

module.exports = FileReader;
