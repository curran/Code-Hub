/**
 * This module deals with the following aspects of dependency management:
 *  - When an app Revision is passed into the model to be stored, it has
 *    as its 'dependencies' property the names of the modules it depends on.
 *    This 'lookupDependencies' function of this module is responsible for 
 *    looking up the current versions of those dependencies, and returning
 *    a revision object whose 'dependencies' property contains a list of 
 *    revision references, which are (scriptId, revNum) pairs.
 *  - When an app is run, this module is responsible for compiling the
 *    dependencies and the app code together into one Javascript bundle,
 *    inspired by http://wiki.commonjs.org/wiki/Modules/CompiledModules
 */
var model = require('./model');
var async = require('async');
var _ = require('underscore');


/**
 * Expects revision.dependencies as an array of module name strings.
 * callback(err, revision)
 * In the revision object passed to the callback, revision.appDependencies
 * is an array of revision reference strings of the form scriptId.revNum
 * pointing to the latest versions of transitive dependencies.
 */
module.exports.lookupDependencies = function(revision, callback){
  if(revision.dependencies && revision.dependencies.length > 0){
    // 'dependencies' will contain revision references looked up from module names
    var dependencies = [];
    
    // this keeps track of which module names have already been looked up
    var addedModuleNames = [];
    
    // concurrency arbitrarily chosen
    // not sure how to pick the best number
    var concurrency = 10;
    
    // TODO Pull out this queue so it is global to the module.
    //      As it is there is no real concurrency limit, as each
    //      call has a limit but there is no limit on the number of simultaneous calls.
    q = async.queue(function(moduleName, callback){
      model.getLatestRevisionByName(moduleName, function(err, revision){
        if(!err){
          dependencies.push(revision.scriptId+'.'+revision.revNum);
          push(revision.dependencies);
        }
        callback(err);
      });
    }, concurrency); 
    
    q.drain = function() {
      revision.appDependencies = dependencies;
      callback(null, revision);
    }
  
    function push(moduleNames){
      _(moduleNames).each(function(moduleName){
        // TODO add: if the module has not already been looked up ...
        if(!_(addedModuleNames).contains(moduleName)){
          addedModuleNames.push(moduleName);
          q.push(moduleName, function (err) {
            if(err){
              q.drain = null; // so the callback is not called twice
              callback(err);
            }
          });
        }
      });
    }
    
    push(revision.dependencies);
  }
  else
    // if no dependencies, don't change the revision object
    callback(null, revision);
}

/**
 * callback(err,templateRevisionRefence)
 */
exports.lookupTemplate = function(revision, callback){
  model.getLatestRevisionByName(revision.templateName, function(err, template){
    if(err)
      callback(err); //TODO test this path
    else{
      revision.template = template.scriptId+'.'+template.revNum;
      callback(null, revision);
    }
  });
}