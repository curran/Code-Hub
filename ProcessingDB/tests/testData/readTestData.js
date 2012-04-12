var fs = require('fs');

/**
 * Reads the file './testData/'+scriptName+'.txt'.
 * callback(err, content);
 */
module.exports = function(scriptName, callback){
  fs.readFile('./testData/'+scriptName+'.txt', 'ascii', callback);
}