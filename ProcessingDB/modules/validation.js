var dependencyManagement = require('./dependencyManagement');
var strings = require('./strings');
var async = require('async');

// callback(err)
function validateTemplateContent(revision, callback){
  var err;
  if(revision.type == 'template'){
    var split = revision.content.split("${code}");
    if(split.length != 2)
      err = strings.wrongNumberOfCodeStringsInTemplate(split.length - 1);
  }
  callback(err)
}

// callback(err)
function validateModuleDependencies(revision, callback){
  if(revision.type == 'module')
    dependencyManagement.lookupDependencies(revision, callback);
  else
    callback(null);
}

/**
 * Checks for various errors in the given revision.
 * callback(err, revision)
 */
exports.validateRevision = function(revision, callback){
  async.series([
    function(callback){
      validateTemplateContent(revision, callback);
    },
    function(callback){
      validateModuleDependencies(revision, callback);
    }
  ],function(err, result){
    callback(err, revision);
  });
}
