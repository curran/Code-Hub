var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');

/**
 * The Git Module of ProcessingDB.
 * 
 * The purpose of this module is to provide an API to the following on-disk model:
 *  - A set of "Scripts"
 *    - Each Script is a Git repository containing a single text file.
 *  - Each Script has a string id.
 *  - Each Script has many revisions with
 *    - revision numbers are incrementing integers starting at 1
 * 
 * Exported methods are provided for
 *  - Setting the text contents of revisions
 *  - Getting the text contents of revisions
 * 
 * The following exported methods are provided:
 *  - setContent(repoId:String, revNum:Number, content:String, callback(err))
 *    Sets the text content of the repository, which
 *     - writes the content to the file on disk in the repository, and
 *     - commits a new revision.
 *    A queue is used to ensure only a single setContent task is being
 *    executed at a time for a given Script.
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
var repoDir = './repos';

//function scriptDir(scriptName){ return repoDir()+'/'+scriptName; }

/**
 * Checks if the repository directory exists.
 * callback(err, exists:Boolean)
 */
function repoDirExists(callback) {
  path.exists(repoDir, function(exists) {
    callback(null, exists)
  });
}

/**
 * Creates the repository directory if it doesn't exist.
 * callback(err)
 */ 
function createRepoDir(callback) {
  repoDirExists(function(exists) {
    exists ? callback() : fs.mkdir(repoDir, 755, callback);
  });
}

/**
 * Deletes the repository directory and all contents.
 * callback(err)
 */
function deleteRepoDir(callback) {
  fs.rmdir(repoDir, callback);
}

/**
 * Sets the content of the given repository and revision number.
 * callback(err)
 */
var _content;
function setContent(repoId, revNum, content, callback){
  //todo implement using async.queue
  _content = content;
  callback();
}

/**
 * Gets the content of the given repository and revision number.
 * callback(err, content:String)
 */

function getContent(repoId, revNum, callback){
  //todo implement
  callback(null,_content);
}

module.exports.repoDirExists = repoDirExists;
module.exports.createRepoDir = createRepoDir;
module.exports.deleteRepoDir = deleteRepoDir;
module.exports.setContent = setContent;
module.exports.getContent = getContent;

