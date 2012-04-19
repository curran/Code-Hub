/**
 * This module exposes an API to the ProcessingDB on-disk model
 * which also performs dependency management tasks.
 * 
 * This is the only module that the route middleware (app.js) should use.
 * This module uses all the others. The dependency graph is as follows:
 * (dependencies go bottom to top)
 * 
 *   strings
 *        \
 *  git  mongodb
 *    \   /
 *    model 
 *     |   \  
 *     |  dependencyManagement
 *     |   /
 *     |  / preprocessor
 *     | / / compilation
 *     |/ / /
 *   backend
 * 
 * TODO make this into a graphviz figure, and update it
 */

var model = require('./model');
var dependencyManagement = require('./dependencyManagement');
var preprocessor = require('../modules/preprocessor');
var compilation = require('./compilation');
var validation = require('./validation');
var async = require('async');

exports.setModelName = model.setModelName;
exports.clearModel = model.clear;
exports.createScript = model.createScript;
exports.disconnect = model.disconnect;

function lookupDependenciesAndTemplateIfApp(revision, callback){
  if(revision.type == 'app'){
    dependencyManagement.lookupDependencies(revision, function(err, revision){
      if(err)
        callback(err);
      else
        dependencyManagement.lookupTemplate(revision, callback);
    });
  }
  else
    callback(null, revision);
}

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
  async.waterfall([
    function(callback){
      preprocessor.parseContent(content, callback);
    },
    function(revision, callback){
      lookupDependenciesAndTemplateIfApp(revision, callback);
    },
    function(revision, callback){
      revision.scriptId = scriptId;
      validation.validateRevision(revision, callback);
    },
    function(revision, cb){
      model.createRevision(scriptId, revision, callback);
    }
  ],
  function(err){
    if(err)
      callback(err);
  });
   // preprocessor.parseContent(content, function(err, revision){
    // if(err)
      // callback(err);
    // else
      // lookupDependenciesAndTemplateIfApp(revision, function(err, revision){
        // if(err)
          // callback(err);
        // else
          // validation.validateRevision(revision, function(err, revision){
            // if(err)
              // callback(err);
            // else
              // model.createRevision(scriptId, revision, callback);
          // });
      // });
  // });
};

exports.getRevision = model.getRevision;
exports.getLatestRevisionByName = model.getLatestRevisionByName;
exports.compileApp = compilation.compileApp;
exports.listScripts = model.listScripts;