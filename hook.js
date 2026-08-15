const fs = require('fs');
const Module = require('module');
const originalCompile = Module.prototype._compile;
Module.prototype._compile = function(content, filename) {
  try {
    return originalCompile.call(this, content, filename);
  } catch(e) {
    fs.appendFileSync('C:\\Users\\ENGR BILLI\\HoloKai-Systems-Labs\\error-log.txt', 'SYNTAX ERROR IN: ' + filename + '\n');
    throw e;
  }
};
