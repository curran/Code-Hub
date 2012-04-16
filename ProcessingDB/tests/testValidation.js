/**
 * This module tests for errors which occur as
 * content is validated.
 */
var backend = require('../modules/backend');
var testData = require('./testData');
var async = require('async');

var prefix = 'validationUnitTest/';

exports.testValidation = function(test){
  async.series([
    function(callback){
      testData.load(prefix+'appDepsNotFound',function(err, scriptId, revNum){
        test.equal(err,"No script found with name 'fdshajfkds'.",'appDepsNotFound');
        callback();
      });
    },
    function(callback){
      testData.load(prefix+'noCodeString',function(err, scriptId, revNum){
        test.equal(err,"Templates must have exactly one occurrence of ${code}. There are 0 occurences in this template.",'appDepsNotFound');
        callback();
      });
    }
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

// manyCodeStrings.txt
// moduleDepsNotFound.txt
// .txt
// testTemplate.txt
// tooFewAppArgs.txt
// tooFewModuleArgs.txt
// tooFewTemplateArgs.txt
// tooManyModuleArgs.txt
// tooManyTemplateArgs.txt
// unknownTemplate.txt
