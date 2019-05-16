const fs = require('fs');
const marked = require('marked');

class FileWriter {
  create(path, contents) {
    try {
      fs.writeFileSync(path, contents);
    } catch(err) {
      throw new Error(err);
    }
  }

  cache(cachePath, contents) {
    this.create(cachePath, this.toHTML(contents));
  }

  toHTML(contents) {
    return marked(contents);
  }

  mkdir(dir) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch(err) {
      throw new Error(err);
    }
  }
}

module.exports = FileWriter;
