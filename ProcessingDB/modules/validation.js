var dependencyManagement = require('./dependencyManagement');
var model = require('./model');
var strings = require('./strings');
var async = require('async');
var _ = require('underscore');

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

// Tests that all app parameters are accepted by the template.
// callback(err)
function validateAppParameters(revision, callback){
  // console.log("revision.templateParameters = "+revision.templateParameters);
  if(revision.type == 'app')
    if(!revision.templateName)
      callback(strings.appWithNoTemplate);
    else{
      var appProperties = revision.appProperties;
      var templateName = revision.templateName;
      model.getLatestRevisionByName(templateName, function(err, revision){
        var templateParameters = revision.templateParameters;
        var err;
        
        _(appProperties).each(function(appProperty){
          var appParameter = appProperty.substring(0, appProperty.indexOf('='));
          console.log("appParameter = "+appParameter);
          if(!_(templateParameters).contains(appParameter))
            err = strings.appParameterNotInTemplate(templateName,appParameter);
        });
        
        //console.log("revision.templateParameters = "+revision.templateParameters);
        
        callback(err);
      });
      //callback(null);
    }
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
    },
    function(callback){
      validateAppParameters(revision, callback);
    }
  ],function(err, result){
    callback(err, revision);
  });
}
