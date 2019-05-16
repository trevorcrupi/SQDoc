const system      = require('../lib/system');
const blacklisted = require('./blacklisted');

exports.blacklisted = blacklisted
exports.ROOT_PATH  = process.cwd();
exports.LOCK_PATH  = system.FileReader.join(exports.ROOT_PATH, 'doc.lock');
