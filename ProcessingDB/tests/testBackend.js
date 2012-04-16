var backend = require('../modules/backend');
var testData = require('./testData');
var async = require('async');
var _ = require('underscore');

/**
 * Tests loading of content into the backend, transitive dependency
 * lookup, and app template lookup.
 */
exports.testAppCompilation = function(test) {
  function assertSetsEqual(expected, actual){
    test.equal(actual.length, expected.length, 'Number of dependencies should match.');
    _(expected).each(function(d){
      test.ok(_(actual).contains(d),'Dependencies should contain '+d);
    });
  }
  var expectedDependencies = [], expectedTemplate;
  async.waterfall([
    function(callback){
      testData.load('math',callback);
    },
    function(scriptId, revNum, callback){
      expectedDependencies.push(scriptId+'.'+revNum);
      testData.load('increment',callback);
    },
    function(scriptId, revNum, callback){
      expectedDependencies.push(scriptId+'.'+revNum);
      testData.load('minimalHTML',callback);
    },
    function(scriptId, revNum, callback){
      expectedTemplate = scriptId+'.'+revNum;
      testData.load('incrementTest',callback);
    },
    function(scriptId, revNum, callback){
      test.equal(scriptId, 4 , "Fourth Script id should be 4, it is "+scriptId);
      test.equal(revNum, 1 , "First revNum should be 1, it is "+revNum);
      backend.getRevision(scriptId, revNum, callback);
      //dependencyManagement.compileAppCode(revision, callback(code))
    },
    function(revision, callback){
      assertSetsEqual(expectedDependencies,revision.appDependencies);
      test.equal(revision.template, expectedTemplate,"Template should match");
      callback();
      //TODO test errors
    }
  ],
  function (err, result) {
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
