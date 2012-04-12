/**
 * This unit test tests the following sequence of events:
 *  - Parse and store in the backend two modules, a template, and an app.
 *  - Compile the app together with its dependencies
 */
var readTestData = require('./testData/readTestData');
var async = require('async');
var preprocessor = require('../modules/preprocessor');
var backend = require('../modules/backend/backend');

// Use a test model so as not to interfere with a production model.
backend.setModelName('Test');


/**
 * Tests extraction of the '@module moduleName' directive.
 */
exports.testModulePreprocessing = function(test) {
  async.waterfall([
    function(callback){
      readTestData('math',function(err,content){
        preprocessor.parseContent(content, function(err, revision){
          backend.createScript(function(err, scriptId){
            backend.createRevision(scriptId, revision, function(err, revNum){
              callback(err, scriptId, revNum);
            });
          });
        });
      });
    },
    function(scriptId, revNum, callback){
      test.equal(scriptId, 1 , "First Script id should be 1, it is "+scriptId);
      test.equal(revNum, 1 , "First revNum should be 1, it is "+revNum);
      readTestData('increment',function(err,content){
        preprocessor.parseContent(content, function(err, revision){
          backend.createScript(function(err, scriptId){
            backend.createRevision(scriptId, revision, function(err, revNum){
              callback(err, scriptId, revNum);
            });
          });
        });
      });
    },
    function(scriptId, revNum, callback){
      test.equal(scriptId, 2 , "Second Script id should be 2, it is "+scriptId);
      test.equal(revNum, 1 , "First revNum should be 1, it is "+revNum);
      callback(null);
    }
  ],
  function (err, result) {
    if(err) throw err;
    test.done();
  });
};

exports.testDisconnect = function(test) {
  backend.clear(function(err){
    backend.disconnect();
    test.done();
  });
};
