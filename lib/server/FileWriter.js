const fs = require('fs');
const marked = require('marked');

class FileWriter {
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
