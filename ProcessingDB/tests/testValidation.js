/**
 * This module tests for errors which occur as
 * content is validated.
 */
var backend = require('../modules/backend');
var testData = require('./testData');
var async = require('async');

var prefix = 'validationUnitTest/';

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
    testLoadError('appDepsNotFound',"No script found with name 'fdshajfkds'."),
    testLoadError('noCodeString',"Templates must have exactly one "+
      "occurrence of ${code}. There are 0 occurences in this template."),
    testLoadError('manyCodeStrings',"Templates must have exactly one "+
      "occurrence of ${code}. There are 2 occurences in this template."),
    testLoadError('moduleDepsNotFound',"No script found with name 'fdshajfkds'.")
      
      
// moduleDepsNotFound.txt
// .txt
// testTemplate.txt
// tooFewAppArgs.txt
// tooFewModuleArgs.txt
// tooFewTemplateArgs.txt
// tooManyModuleArgs.txt
// tooManyTemplateArgs.txt
// unknownTemplate.txt

      
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

