/**
 * This is the module providing the API to the ProcessingDB backend.
 * All interactions between the ProcessingDB middleware and the backend
 * should take place through this module, to ensure consistency between
 * the Git repositories the MongoDB database which together implement
 * the on-disk ProcessingDB model.
 */

//TODO rename this module to 'model' or 'store' or 'onDiskModel'

var git = require('./git');
var db = require('./mongodb');

/**
 * Sets the name of the Git repositories directory to "./reposModelName"
 * and sets the MongoDB database name to "ProcessingDBModelName"
 * where "ModelName" is the argument passed to this function.
 * This is useful for unit testing.
 */
exports.setModelName = function(modelName){
  git.setReposDir('./repos'+modelName);
  db.setDbName('ProcessingDB'+modelName);
}

exports.createScript = db.createScript;

/**
 * Clears the content of the Git repositories
 * and MongoDB database.
 * callback(err)
 */
exports.clear = function(callback){
  db.clear(function(err1){
    git.deleteReposDir(function(err2){
      callback(err1 || err2);
    });
  });
}

/**
 * Disconnects from MongoDB so the Node process can end.
 * Useful for unit testing.
 */
exports.disconnect = db.disconnect;

/**
 * Creates a new revision entry in the MongoDB database
 * and tracks the content using Git.
 * @param {scriptId} The id of the script for which to 
 *   create the new revision.
 * @param {revisionObject} The content to be persisted,
 *   expected to contain the following fields:
 *  - scriptId
 *  - revNum
 *  - commitMessage: String
 *  - commitDate: Date,
 *  - parentRevision: String, "scriptId.revNum" or ""
 *  - type: String, // in ['module','app','template']
 *  - name: String,
 *    relevant when (type == 'module' || type == 'template')
 *  - dependencies: Array of Strings,
 *    relevant when type == 'module' or type == 'app'
 *    Contains direct dependencies by module name
 *      of the form ["moduleA","moduleB","moduleC"]
 *    If type == 'app', transitive dependencies will 
 *    be evaluated and stored in the on-disk model at the
 *    time this function is called.
 *  - template: String // "scriptId.revNum" or ""
 *    relevant when type == 'app'
 *  - content: String The text content to be tracked using Git.
 * @param callback(err, revNum) Passes the new revision number.
 */
exports.createRevision = function(scriptId, revisionObject, callback){
  scriptId = parseInt(scriptId); //in case we get strings as input
  if(!revisionObject)
    callback("Revision object is null.");
  else{
    var content = revisionObject.content || "";
    db.createRevision(scriptId, revisionObject, function(err,revNum){
      if(err)
        callback(err);
      else{
        git.setContent(scriptId, revNum, content, function(err){
          callback(err, revNum);
        });
      }
    });
  }
};

/**
 * Gets a revision entry from the database and the content from Git.
 * The object passed to the callback is of the same
 * form as the object passed into createRevision, with additional
 * scriptId and revNum properties.
 * callback(err,revisionFromBackend)
 */
exports.getRevision = function(scriptId, revNum, callback){
  db.getRevision(scriptId, revNum, function(err, revision){
    if(err) callback(err);
    else{
      git.getContent(scriptId, revNum, function(err, content){
        revision.content = content;
        revision.scriptId = scriptId;
        revision.revNum = revNum;
        callback(null,revision);
      });
    }
  });
};

exports.getLatestRevisionByName = db.getLatestRevisionByName;