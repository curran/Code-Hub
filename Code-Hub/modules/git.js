var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var async = require('async');

/**
 * The Git Module of CodeHub.
 *
 * The purpose of this module is to provide an API to the following on-disk model:
 *  - A set of "Scripts"
 *    - Each Script is a Git repository containing a single text file.
 *  - Each Script has a string id, which is the name of its repository directory.
 *  - Each Script has many revisions
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
  child_process.exec("rm -r -f " + reposDir, callback);
}

function spawn(cwd, command, args){
  return child_process.spawn(command, args, {cwd : cwd});
}


function run(cwd, command, args) {
  return function(callback){
    var child = spawn(cwd, command, args);
    child.on('exit', function(exitCode){ callback(); });
  }
}

function initScriptRepo(scriptId, callback){
  var dir = scriptDir(scriptId);
  async.waterfall([
    function(callback){ fs.mkdir(dir, callback); },
    run(dir, 'git', ['init']),
    run(dir, 'touch', [CONTENT_FILE_NAME]),
    run(dir, 'git', ['add','./']),
    function(){ callback(); }
  ]);
}

function ensureScriptRepoExists(scriptId, callback){
  ensureReposDirExists(function(err){
    path.exists(scriptDir(scriptId), function(exists) {
      exists ? callback() : initScriptRepo(scriptId, callback);
    });
  });
}

/**
 * Sets the content of the given repository and revision number.
 * callback(err)
 */
function setContent(scriptId, revNum, content, callback) {
  var dir = scriptDir(scriptId);
  async.series([
    function(callback){ ensureScriptRepoExists(scriptId, callback); },
    function(callback){ fs.writeFile(dir+'/'+CONTENT_FILE_NAME, content, callback); },
    run(dir, 'git',['commit','-m','x','-a']),
    run(dir, 'git',['tag','-a','v'+revNum,'-m','x']),
    function(){ callback(); }
  ]);
}

var setContentTaskQueue = async.queue(function (task, callback) {
  setContent(task.scriptId, task.revNum, task.content, callback);
}, 1);

function queueSetContentTask(scriptId, revNum, content, callback){
  setContentTaskQueue.push({scriptId: scriptId,revNum:revNum,content:content}, callback);
}

function getContent(scriptId, revNum, callback) {
  var dir = scriptDir(scriptId);
  path.exists(dir, function(exists) {
    if(!exists)
      callback('No script exists with id '+scriptId);
    else{
      var child = spawn(dir, 'git', ['show', 'v' + revNum + ':' + CONTENT_FILE_NAME]);
      var content = [], failed = false;
      child.stdout.on('data', function(data) { content.push(data); });
      child.stderr.on('data', function(data) { failed = true; });
      child.on('exit', function(exitCode) {
        if(failed)
          callback('Revision '+revNum+' does not exists for script '+scriptId);
        else
          callback(null, content.join(''));
      });
    }
  });
}

exports.reposDirExists = reposDirExists;
exports.ensureReposDirExists = ensureReposDirExists;
exports.deleteReposDir = deleteReposDir;
exports.setContent = queueSetContentTask;
exports.getContent = getContent;
exports.setReposDir = function(newReposDir){
  reposDir = newReposDir;
}
