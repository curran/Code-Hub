// A module for interacting with a store of versioned
// scripts with dependency information. The store is backed
// by a system using both MongoDB and Git.
//
// API documentation at the bottom of the file.
//
// Author: Curran Kelleher

var db  = require('./db'),
    git = require('./git'),
    dsl = require('./dsl');

// The version number used as the first version for new scripts.
// TODO make this into a string
var firstVersion = 0;

function insertNew(name, callback) {
  if(name === '')
    callback(new Error('Please enter a script name.'));
  else db.insertNewScript(name, firstVersion, function(err){
    if(err) callback(err);
    else git.createRepo(name,function(err){
      if(err) callback(err);
      else git.tagRepo(name, firstVersion, callback);
    });
  });
}

// checkAllExist(revisions, callback(err,name,version))
//
// Checks that all given revisions
// (objects having 'name' and 'version' properties)
// correspond to objects which exist in the database.
// If one of the revisions is not found in the database,
// the callback is called with an error message and the
// name and version of the non-existent revision.
function checkAllExist(revisionsToCheck, callback){
  revisionsToCheck = revisionsToCheck.slice(0);
  (function iterate(){
    if(revisionsToCheck.length == 0)
      callback();
    else{
      revision = revisionsToCheck.splice(0,1)[0];
      db.findRevision(revision.name, 
                      revision.version,
                      function(error, revisionInDB){
        if(revisionInDB)
          process.nextTick(iterate);
        else{
          callback("version "+revision.version+" of script \""+revision.name+"\" not found.",revision.name,revision.version);
          return;
        }
      });
    }
  }());
}

// validateDependenciesAndTemplate(revision, callback(err))
//
// Expects revision.dependencies as an array of revision pointer
// objects (each with properties 'name' and 'version), and 
// optionally revision.template as an object with the same properties.
//
// Checks that revisions referred to by objects in revision.dependencies
// and revision.template are revisions in the database.
function validateDependenciesAndTemplate(revision, callback){
  checkAllExist(revision.dependencies, function(err, name, version){
    if(err)
      callback("Error in line \"@depends on "+name
        +" "+version+"\" - "+err);
    else
      if(revision.template)
        checkAllExist([revision.template], function(err,name,version){
          if(err){
            callback("Error in line \"@embed in "+name
              +" "+version+"\" - "+err);
          }
          else
            callback(null);
        });
      else
        callback(null);
  });
  
}

function setContent(name, content, message, callback) {
  var revision = {
    name: name,
    content: content,
    message: message
  };
  dsl.addDependenciesAndTemplate(revision, function(err){
    if(err)
      callback(err);
    else{
      validateDependenciesAndTemplate(revision, function(err){
        if(err) callback(err);
        else db.incrementLatestVersion(name, function(err, latestVersion){
          revision.version = latestVersion;
          db.saveRevision(revision,function(err){
            if(err) callback(err);
            else git.setContent(name, content, function(err){
              if(err) callback(err);
              else git.tagRepo(name, latestVersion, function(err){
                callback(err, latestVersion);
              });
            });
          });
        });
      });
    }
  });
  
};

function findRevisionWithContent(name, version, callback){
  db.findRevision(name, version, function(err, revision){
    if(err) callback(err);
    else git.getContent(name, version, function(err, content){
      if(err) callback(err);
      else{
        revision.content = content;
        callback(err, revision);
      }
    });
  });
}

function addScriptToDependencies(script, dependencies, callback){
  var scriptAlreadyInDependencies = false;
  // if the script is already in the list but using an older version,
  for(var i in dependencies){
    var dependency = dependencies[i];
    if(dependency.name == script.name){
      scriptAlreadyInDependencies = true;
      // use the latest version of the script instead
      if(dependency.version < script.version)
        dependencies[i] = script;
    }
  }
  
  // otherwise just add the script to the end of the list
  if(!scriptAlreadyInDependencies)
    dependencies.push(script);
  
  callback();
}

function addDependenciesOfScript(script, dependencies, callback){
  if(script.dependencies.length != 0){
    var left = script.dependencies.length;
    // this approach parallelizes IO for each dependency of a script,
    // which works because the order of dependencies of a given script 
    // doesn't matter, and this code ensures that all dependencies are
    // in the dependency list before the scripts that depend on them.
    script.dependencies.forEach(function(dependency){
      db.findRevision(dependency.name, dependency.version,
                   function(err, dependency){
        // add this script's dependencies to the dependency list,
        addDependenciesOfScript(dependency,dependencies,function(){
          if(--left === 0)
            // then add this script itself to the dependency list
            // and call the callback
            addScriptToDependencies(script,dependencies,callback);
        });
      });
    });
  }
  else
    addScriptToDependencies(script,dependencies,callback);
}

function evaluateDependencies(name,version,callback){
  db.findRevision(name, version, function(err,revision){
    var dependencies = [];
    addDependenciesOfScript(revision,dependencies,function(){
      callback(dependencies);
    });
  });
}

// getContent(name, version, callback(error, content))
// 
// Retreives the content of the Git repository with the
// given 'name' for the given 'version'. The callback
// argument 'content' is a String containing the content
// of the single file in the Git repository.
module.exports.getContent = git.getContent;

// findRevision(name, version, callback(error, revision))
//
// Finds the revision with the given name and version.
// The callback argument 'revision' has:
//  - name: String - The name of the Script to which 
//                   this revision belongs.
//  - version: Number - The version of this revision
//  - dependencies: [{name: , version: }] 
//    - The dependencies of this revision, an array of
//      objects referring to Revisions by name and version.
//  - template: {name: , version: } - A reference to the script
//                                    which serves as a template
//                                    for this revision.
//  - message: String - The commit message of this revision.
module.exports.findRevision = db.findRevision;

// findRevisionWithContent(name, version, callback(error, revision))
//
// Finds the revision with the given name and version, and adds to
// it the content from the Script's Git repository.
// The callback argument 'revision' has:
//  - name: String - The name of the Script to which 
//                   this revision belongs.
//  - version: Number - The version of this revision
//  - dependencies: [{name: , version: }] 
//    - The dependencies of this revision, an array of
//      objects referring to Revisions by name and version.
//  - template: {name: , version: } - A reference to the script
//                                    which serves as a template
//                                    for this revision.
//  - message: String - The commit message of this revision.
//  - content: String - The content retrieved from the Git repository
module.exports.findRevisionWithContent = findRevisionWithContent;

// setContent(name, content, message, callback(error, newVersion))
//
// Sets the content of the given script. This causes the following:
//  - The 'latestRevision' of the Script database entry with the 
//    given 'name' is incremented.
//  - A new Revision entry is inserted into the database
//    - whose 'version' is the Script's 'latestVersion'
//    - storing the 'message' argument
//  - The content of the Git repository associated with the Script
//    is updated to the given content and tagged with the new version.
// The callback is called with the new version number.
module.exports.setContent = setContent;

// insertNew(name, callback(error))
//
// Inserts a new empty Script with the given name.
// This creates a new Script entry in the database, a first
// Revision entry in the database, and also initializes a new
// Git repository for the new script.
module.exports.insertNew = insertNew;

// The version number used as the first version for new scripts.
module.exports.FIRST_VERSION = firstVersion;

// setDirectoryPrefix()
// 
// Sets the prefix of the directory path used.
// Needs to be called only when the Node working directory
// is different from where app.js is (e.g. in scripts/export.js)
module.exports.setDirectoryPrefix = git.setDirectoryPrefix;

// evaluateDependencies(name,version,callback(dependencies))
//
// Evaluates the dependencies of the Revision with the given 
// 'name' and 'version'. If two versions of the same script are
// required, only the most recent version is included. The 
// callback argument 'dependencies' is a list of objects
// with the properties
//  - name
//  - version
// which rever to revisions. The 'dependencies' array is in
// topologically sorted order with respect to the dependency
// graph, and includes as the last entry the Revision with the
// given 'name' and 'version'.
module.exports.evaluateDependencies = evaluateDependencies;

// findAllScripts(callback(error, allScripts))
// 
// Finds all Script entries in the database.
// The callback argument 'allScripts' is an array
// of objects which each have the following properties:
//  - name: String - The name of the script
//  - latestVersion: String - The latest version of the script
module.exports.findAllScripts = db.findAllScripts;

// findAllRevisions(callback(error, allRevisions))
//
// Finds all revisions of the given script. The callback
// argument 'allRevisions' is an array of objects which 
// each have the following properties:
//  - name: String - The name of the Script to which 
//                   this revision belongs.
//  - version: Number - The version of this revision
//  - dependencies: [{name: , version: }] 
//    - The dependencies of this revision, an array of
//      objects referring to Revisions by name and version.
//  - template: {name: , version: } - A reference to the script
//                                    which serves as a template
//                                    for this revision.
//  - message: String - The commit message of this revision.
module.exports.findAllRevisions = db.findAllRevisions;
