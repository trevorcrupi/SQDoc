const FileReader = require('./FileReader');
const FileWriter = require('./FileWriter');
const Cache      = require('./Cache');

exports.FileReader = new FileReader();
exports.FileWriter = new FileWriter();
exports.Cache      = (projectNameTrimmed) => { return new Cache(projectNameTrimmed) }