const fs = require('fs');
const marked = require('marked');

class FileWriter {
  create(path, contents, ext) {
    try {
      fs.writeFileSync(path + ext, contents);
    } catch(err) {
      throw new Error(err);
    }
  }

  cache(cachePath, contents) {
    try {
      fs.writeFileSync(cachePath, this.toHTML(contents));
    } catch(err) {
      throw new Error(err);
    }
  }

  toHTML(contents) {
    return marked(contents);
  }
}

module.exports = FileWriter;
