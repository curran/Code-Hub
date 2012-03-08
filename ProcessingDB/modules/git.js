var spawn = require('child_process').spawn, fs = require('fs'), path = require('path');

//var CONTENT_FILE_NAME = 'c';
var prefix = '.';
var repoDirName = 'repos';
function repoDir() {
  return prefix + '/' + repoDirName;
}

//function scriptDir(scriptName){ return repoDir()+'/'+scriptName; }

// checks if the repository directory exists
// callback(err, exists:Boolean)
function repoDirExists(callback) {
  path.exists(repoDir(), function(exists) {
    callback(null, exists)
  });
}

// creates the repository directory if it doesn't exist
// callback(err)
function createRepoDir(callback) {
  repoDirExists(function(exists) {
    if(exists)
      callback(null);
    else
      fs.mkdir(repoDir(), 0755, callback);
  });
}

// deletes the repository directory and all contents
// callback(err)
function deleteRepoDir(callback) {
  fs.rmdir(repoDir(), callback);
}

module.exports.repoDirExists = repoDirExists;
module.exports.createRepoDir = createRepoDir;
module.exports.deleteRepoDir = deleteRepoDir;
