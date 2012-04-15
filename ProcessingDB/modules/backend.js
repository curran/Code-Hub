/**
 * This module exposes an API to the ProcessingDB on-disk model
 * which also performs dependency management tasks.
 * 
 * This is the only module that the route middleware (app.js) should use.
 * This module uses all the others. The dependency graph is as follows:
 * (dependencies go bottom to top)
 * 
 *  git  mongodb
 *    \   /
 *    model 
 *     |   \  
 *     |  dependencyManagement
 *     |   /
 *     |  /  preprocessor
 *     | /  /
 *   backend
 */

var model = require('./model');
var dependencyManagement = require('./dependencyManagement');
var preprocessor = require('../modules/preprocessor');

exports.setModelName = model.setModelName;
exports.clearModel = model.clear;
exports.createScript = model.createScript;
exports.disconnect = model.disconnect;


/**
 * Creates a new revision in the on-disk model.
 * @param {scriptId} The id of the script for which to 
 *   create the new revision.
 * @param {content} The content of the revision to be persisted.
 *   ProcessingDB directives are parsed from the content.
 *   If type == 'app', 
 *   Transitive dependencies will be evaluated and stored 
 *     in the on-disk model as revision references
 *     at the time this function is called.
 *   revision.template will be looked up and stored as a revision reference.
 * @param callback(err, revNum) Passes the new revision number.
 */
exports.createRevision = function(scriptId, content, callback){
  preprocessor.parseContent(content, function(err, revision){
    if(revision.type == 'app'){
      dependencyManagement.lookupDependencies(revision, function(err, revision){
        dependencyManagement.lookupTemplate(revision, function(err, revision){
          model.createRevision(scriptId, revision, callback);
        });
      });
    }
    else
      model.createRevision(scriptId, revision, callback);
  });
};

exports.getRevision = model.getRevision;
exports.getLatestRevisionByName = model.getLatestRevisionByName;