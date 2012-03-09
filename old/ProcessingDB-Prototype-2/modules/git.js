// A module for interacting with Git.
//
// API documentation at the bottom of the file.
//
// Author: Curran Kelleher

var spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
var CONTENT_FILE_NAME = 'content.txt';
var prefix = '.';
var repoDirName = 'repos';
function repoDir(){ return prefix+'/'+repoDirName; }
function dirFromName(name){ return repoDir()+'/'+name; }

// executes a series of command line commands serially.
// callback()
function executeCommands(dir, queue, callback){
  (function iterate(){
    if(queue.length === 0)
      callback();
    else{
      var task = queue.splice(0,1)[0];
      spawn(task.command,task.args,{cwd:dir}).on('exit', iterate);
    }
  })();
}

function ensureRepoDirectoryExists(callback){
  path.exists(repoDir(), function (exists) {
    if(exists)
      callback();
    else
      fs.mkdir(repoDir(),0755, callback);
  });
}

function createRepo(name,callback){
  ensureRepoDirectoryExists(function(err){
    if(err) callback(err);
    else {
      var dir = dirFromName(name);
      fs.mkdir(dir, 0755, function(err){
        if(err) callback(err);
        else executeCommands(dir,[
          {command:'git', args:['init']},
          {command:'touch', args:[CONTENT_FILE_NAME]},
          {command:'git', args:['add','*']},
          {command:'git', args:['commit','-m','Initial Creation']}
        ], callback);
      });
    }
  });
}

function tagRepo(name, version, callback){
  executeCommands(dirFromName(name),[
    {command:'git', args:['commit','-m','x','-a']},
    {command:'git', args:['tag','-a','v'+version,'-m','x']}
  ], callback);
}

function getContent(name, version, callback){
  var child = spawn('git',['show', 'v'+version+':'+CONTENT_FILE_NAME],
    { cwd: dirFromName(name) });
  var content = '';
  child.stdout.on('data',function(data){ content += data.toString(); });
  child.on('exit', function(code){ 
    callback(null,content);
  });
};

function setContent(name, content, callback){
  fs.writeFile(dirFromName(name)+'/'+CONTENT_FILE_NAME, content, callback);
}

// createRepo(name,callback(error))
//
// Creates a new Git repository with the given name,
// containing a single file called content.txt.
module.exports.createRepo = createRepo;

// tagRepo(name, version, callback(error))
//
// Commits and tags the Git repository with the
// given 'name' with the given 'version'.
module.exports.tagRepo = tagRepo;

// setContent(name, content, callback(error))
//
// Sets the content of the Git repository with the 
// given 'name' to the given text 'content'.
module.exports.setContent = setContent;

// getContent(name, version, callback(error, content))
// 
// Retreives the content of the Git repository with the
// given 'name' for the given 'version'. The callback
// argument 'content' is a String containing the content
// of the single file in the Git repository.
module.exports.getContent = getContent;

/******************************************
 * Methods below intended for use only by *
 * import, export, and testing scripts.   *
 ******************************************/

// setDirectoryPrefix()
// 
// Sets the prefix of the directory path used.
// Needs to be called only when the Node working directory
// is different from where app.js is (e.g. in scripts/export.js)
module.exports.setDirectoryPrefix = function(newPrefix){ prefix = newPrefix; };
