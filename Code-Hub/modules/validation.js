var dependencyManagement = require('./dependencyManagement');
var model = require('./model');
var strings = require('./strings');
var async = require('async');
var _ = require('underscore');

// callback(err)
function validateTemplateContent(revision, callback){
  var err;
  if(revision.type == 'template'){
    var split = revision.content.split(strings.scriptsPlaceholder);
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

// Tests that all app parameters are accepted by the template.
// callback(err)
function validateAppParameters(revision, callback){
  // console.log("revision.templateParameters = "+revision.templateParameters);
  if(revision.type == 'app')
    if(!revision.templateName)
      callback(strings.appWithNoTemplate);
    else{
      var appParameters = _.map(revision.appProperties, function(appProperty){
        return appProperty.substring(0, appProperty.indexOf('='));
      });
      var templateName = revision.templateName;
      model.getLatestRevisionByName(templateName, function(err, revision){
        var templateParameters = revision.templateParameters;
        var err;
        
        // returns an object if a is a subset of b, null if not.
        // e.g. when all elements of a are contained in b.
        // The object returned is the first encountered which
        // is in a and not in b.
        // function subset(a,b){
          // _(a).each(function(aElement){
            // if(!_(b).contains(aElement))
              // return aElement;
          // });
          // return null;
        // }
        
        
        // Test that all app properties are contained in the template parameters
        _(appParameters).each(function(appParameter){
          if(!_(templateParameters).contains(appParameter))
            err = strings.appParameterNotInTemplate(templateName,appParameter);
        });
        
        // Test that all template parameters are contained in the app properties
        if(!err){
          _(templateParameters).each(function(templateParameter){
            if(!_(appParameters).contains(templateParameter))
              err = strings.templateParameterNotInApp(templateName,templateParameter);
          });
        }
        
        callback(err);
      });
    }
  else
    callback(null);
}

// Tests for unique name.
// callback(err)
function validateName(scriptId, revision, callback){
  if(revision.name){
    model.getLatestRevisionByName(revision.name, function(err, latestRevision){
      // If no revision has been found with this name, then no script
      // exists with the name of the new one, so callback with no error.
      // Also if a script with the given name does already exist, but it is
      // the same as the script being saved, this is OK, so callback with no error.
      if(err || latestRevision.scriptId == scriptId)
        callback(null);
      else
      // If the code gets here, it means there is a name conflict with another script.
        callback(strings.scriptAlreadyExistsWithName(revision.name));
    });
  }
  else
    callback(null);
}

/**
 * Checks for various errors in the given revision.
 * callback(err, revision)
 */
exports.validateRevision = function(scriptId, revision, callback){
  async.series([
    function(callback){
      if(!revision.type)
        callback(strings.noType);
      else
        validateTemplateContent(revision, callback);
    },
    function(callback){
      validateModuleDependencies(revision, callback);
    },
    function(callback){
      validateAppParameters(revision, callback);
    },
    function(callback){
      validateName(scriptId, revision, callback);
    }
  ],function(err, result){
    callback(err, revision);
  });
}
