var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

/**
 * The Git Module of ProcessingDB.
 * 
 * The purpose of this module is to provide an API to the following model:
 *  - A set of Git repositories, each containing a single text file.
 *  - Each repository has a string id.
 *  - Each repository has many revisions.
 *  - Revisions have revision numbers
 *    - starting at 1
 *    - incrementing at the latest revision number of the repository
 * Exported methods are provided for
 *    - Setting the text contents, which
 *      - commits a new revision, and
 *      - increments the latest revision number of the repository
 *    - Getting the text contents
 *      - For a particular revision number
 *    - Getting the latest revision number
 *      - For a particular repository
 * 
 * 
 * The following exported methods are provided:
 *    - setContent(repoId:String, content:String, revNum:Number)
 *      Sets the text contents (contents) of the repository, which
 *      - commits a new revision, and
 *      - increments the latest revision number of the repository
 *    - Getting the text contents
 *      - For a particular revision number
 *    - Getting the latest revision number
 *      - For a particular repository
 * 
 * 
 * The following lower level methods are made available only to support unit testing:
 *  - createRepoDir(callback(err))
 *    Creates the repository directory if it doesn't already exist.
 *    Does nothing if the repository directory already exists.
 *  - repoDirExists(callback(err,exists:Boolean))
 *    Tests whether or not the repository directory exists.
 */

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
    exists ? callback() : fs.mkdir(repoDir(), 755, callback);
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
