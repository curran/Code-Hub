/**
 * This module exposes an API to the CodeHub on-disk model
 * which also performs dependency management tasks.
 * 
 * This is the only module that the route middleware (app.js) should use.
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
 *   CodeHub directives are parsed from the content.
 *   If type == 'app', 
 *   Transitive dependencies will be evaluated and stored 
 *     in the on-disk model as revision references
 *     at the time this function is called.
 *   revision.template will be looked up and stored as a revision reference.
 * @param {parentRevision} The parent revision of the revision to be
 *   persisted, of the form 'scriptId.revNum'.
 *   
 * @param callback(err, revNum) Passes the new revision number.
 */
exports.createRevision = function(scriptId, content, parentRevision, callback){
  async.waterfall([
    function(callback){
      preprocessor.parseContent(content, callback);
    },
    function(revision, callback){
      lookupDependenciesAndTemplateIfApp(revision, callback);
    },
    function(revision, callback){
      validation.validateRevision(scriptId, revision, callback);
    },
    function(revision, cb){
      revision.commitDate = new Date();
      if(parentRevision){
        console.log('parentRevision = '+parentRevision);        
        revision.parentRevision = parentRevision;
      }
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