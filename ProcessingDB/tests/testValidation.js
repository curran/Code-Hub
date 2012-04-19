/**
 * This module tests for errors which occur as
 * content is validated.
 */
var backend = require('../modules/backend');
var testData = require('./testData');
var async = require('async');
var strings = require('../modules/strings');

var prefix = 'validationUnitTest/';

exports.clearModel = function(test) {
  backend.clearModel(function(err){
    test.done();
  });
};

exports.testValidation = function(test){
  function testLoadError(scriptName, expectedErr){
    return function(callback){
      testData.load(prefix+scriptName,function(err, scriptId, revNum){
        if(expectedErr){
          test.equal(err,expectedErr,scriptName);
          if(err != expectedErr)
            console.log('err = '+err);
        }
        else
          throw err;
        callback();
      });
    }
  }
  
  async.series([
    function(callback){
      testData.load(prefix+'testTemplate',callback);
    },
    //testLoadError('testTemplate', strings.scriptAlreadyExistsWithName('testTemplate')),
    testLoadError('appDepsNotFound',"No script found with name 'fdshajfkds'."),
    testLoadError('moduleDepsNotFound',"No script found with name 'fdshajfkds'."),
    testLoadError('noCodeString',"Templates must have exactly one "+
      "occurrence of ${code}. There are 0 occurences in this template."),
    testLoadError('manyCodeStrings',"Templates must have exactly one "+
      "occurrence of ${code}. There are 2 occurences in this template."),
    testLoadError('moduleDepsNotFound',"No script found with name 'fdshajfkds'."),
    testLoadError('tooFewAppArgs', strings.wrongNumArgs('app')),
    testLoadError('tooFewModuleArgs', strings.wrongNumArgs('module')),
    testLoadError('tooManyModuleArgs', strings.wrongNumArgs('module')),
    testLoadError('tooFewTemplateArgs', strings.wrongNumArgs('template')),
    testLoadError('tooManyTemplateArgs', strings.wrongNumArgs('template')),
    testLoadError('unknownTemplate',"No script found with name 'fdsafhdjs'."),
    testLoadError('appWithNoTemplate', strings.appWithNoTemplate),
    function(callback){
      testData.load(prefix+'templateWithParams',callback);
    },
    testLoadError('appParametersNotInTemplate',strings.appParameterNotInTemplate('templateWithParams', 'thisArg')),
    testLoadError('templateParametersNotInApp',strings.templateParameterNotInApp('templateWithParams', 'bar'))
    
  ],function(err, result){
    if(err) throw err;
    test.done();
  });
};


exports.testDisconnect = function(test) {
  backend.clearModel(function(err){
    backend.disconnect();
    test.done();
  });
};

