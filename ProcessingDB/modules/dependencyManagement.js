/**
 * This module deals with the following aspects of dependency management:
 *  - When an app Revision is passed into the backend to be stored, it has
 *    as its 'dependencies' property the names of the modules it depends on.
 *    This 'lookupDependencies' function of this module is responsible for 
 *    looking up the current versions of those dependencies, and returning
 *    a revision object whose 'dependencies' property contains a list of 
 *    revision references, which are (scriptId, revNum) pairs.
 *  - When an app is run, this module is responsible for compiling the
 *    dependencies and the app code together into one Javascript bundle,
 *    inspired by http://wiki.commonjs.org/wiki/Modules/CompiledModules
 */
var backend = require('../modules/backend/backend');
var async = require('async');
var _ = require('underscore');


/**
 * Expects revision.dependencies as an array of module name strings.
 * callback(err, revision)
 * In the revision object passed to the callback, revision.dependencies
 * is an array of revision reference strings of the form scriptId.revNum.
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
    
    q = async.queue(function(moduleName, callback){
      backend.getLatestRevisionByName(moduleName, function(err, revision){
        if(!err){
          dependencies.push(revision.scriptId+'.'+revision.revNum);
          push(revision.dependencies);
        }
        callback(err);
      });
    }, concurrency); 
    
    q.drain = function() {
      revision = _.clone(revision); //to avoid side effects
      revision.dependencies = dependencies;
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
