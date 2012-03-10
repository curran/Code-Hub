var child_process = require('child_process');
var spawn = child_process.spawn;
var fs = require('fs');
var path = require('path');
var async = require('async');

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
 *  - setContent(scriptId:String, revNum:Number, content:String, callback(err))
 *    Sets the text content of the script repository, which
 *     - initializes the script repository if it doesn't already exist,
 *     - writes the content to the file on disk in the repository, and
 *     - commits a new revision,
 *     - tags the new revision with the given revision number
 *    A queue is used to ensure only a single setContent task is being
 *    executed at a time for a given script id.
 *
 *
 * The following lower level methods are made available only to support unit testing:
 *  - createReposDir(callback(err))
 *    Creates the directory containing script repositories if it doesn't already exist.
 *    Does nothing if the directory already exists.
 *  - reposDirExists(callback(err,exists:Boolean))
 *    Tests whether or not the directory containing script repositories exists.
 */

var CONTENT_FILE_NAME = 'content.txt';
var reposDir = './repos';

function scriptDir(scriptId) {
  return reposDir + '/' + scriptId;
}

function ensureDirExists(dir, callback) {
  path.exists(dir, function(exists) {
    exists ? callback() : fs.mkdir(dir, callback);
  });
}

function reposDirExists(callback) {
  path.exists(reposDir, function(exists) {
    callback(null, exists)
  });
}

function ensureReposDirExists(callback) {
  ensureDirExists(reposDir, callback);
}

function deleteReposDir(callback) {
  child_process.exec("rm -r " + reposDir, callback);
}

function initScriptRepo(scriptId, callback){
  var dir = scriptDir(scriptId);
  fs.mkdir(dir, function(err){
    var child = spawn('touch', [CONTENT_FILE_NAME], {
      cwd : dir
    });
    child.on('exit', function(err) {
      callback()
    });
  });
}

function ensureScriptRepoExists(scriptId, callback){
  ensureReposDirExists(function(err){
    path.exists(scriptDir(scriptId), function(exists) {
      exists ? callback() : initScriptRepo(scriptId, callback);
    });
  });
}

function run(cwd, command, args, callback) {
  var options = {
    cwd : cwd
  };
  var child = spawn(command, args, options);
  child.on('exit', callback);
}

/**
 * Sets the content of the given repository and revision number.
 * callback(err)
 */
var _content;
function setContent(scriptId, revNum, content, outerCallback) {
  var dir = scriptDir(scriptId);
  async.waterfall([
    function(callback){
      ensureScriptRepoExists(scriptId, callback);
    },
    function(callback){
      fs.writeFile(scriptDir(scriptId)+'/'+CONTENT_FILE_NAME, content, callback);
    },
    function(callback) {
      //{command:'git', args:['commit','-m','x','-a']},
      //{command:'git', args:['tag','-a','v'+version,'-m','x']}
      run(dir, 'git',['commit','-m','x','-a'],outerCallback);
    }
  ]);
}

/**
 * Gets the content of the given repository and revision number.
 * callback(err, content:String)
 */

function getContent(repoId, revNum, callback) {
  //todo implement
  callback(null, _content);
}

module.exports.reposDirExists = reposDirExists;
module.exports.ensureReposDirExists = ensureReposDirExists;
module.exports.deleteReposDir = deleteReposDir;
module.exports.setContent = setContent;
module.exports.getContent = getContent;
