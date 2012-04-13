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

/**
 * Expects revision.dependencies as an array of module name strings.
 * callback(err, revision)
 * In the revision object passed to the callback, revision.dependencies
 * is an array of revision reference strings of the form scriptId.revNum.
 */
module.exports.lookupDependencies = function(revision, callback){
  // this array will contain revision references looked up from module names
  var dependencies = [];
  async.forEach(revision.dependencies,function(moduleName, callback){
    backend.getLatestRevisionByName(moduleName, function(err, scriptId, revNum){
      dependencies.push(scriptId+'.'+revNum);
      callback(err);
    });
  }, function(err){
    revision.dependencies = dependencies;
    callback(err, revision);
  });
}
