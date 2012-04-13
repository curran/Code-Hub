/**
 * This unit test tests the following sequence of events:
 *  - Parse and store in the backend two modules, a template, and an app.
 *  - Compile the app together with its dependencies
 */
var readTestData = require('./testData/readTestData');
var preprocessor = require('../modules/preprocessor');
var backend = require('../modules/backend/backend');
var dependencyManagement = require('../modules/dependencyManagement');
var async = require('async');
var _ = require('underscore');


// Use a test model so as not to interfere with a production model.
backend.setModelName('Test');

exports.testLookupDependencies = function(test){
  var foo = {
    type: 'module',
    name: 'foo'
  };
  var bar = {
    type: 'module',
    name: 'bar'
  };
  var baz = {
    type: 'module',
    name: 'baz',
    dependencies: ['foo','bar']
  };
  
  function loadRevision(revision, callback){
     backend.createScript(function(err, scriptId){
      backend.createRevision(scriptId, revision, function(err, revNum){
        revision.scriptId = scriptId;
        revision.revNum = revNum;
        callback(err);
      });
    });
  }
  
  function id(revision){
    return revision.scriptId+'.'+revision.revNum
  }
  
  async.waterfall([
    function(callback){ loadRevision(foo, callback);  },
    function(callback){ loadRevision(bar, callback);  },
    function(callback){ dependencyManagement.lookupDependencies(baz, callback); },
    function(bazAfter, callback){
      var expected = [id(foo),id(bar)];
      test.equal(bazAfter.dependencies.length, expected.length, 'Number of dependencies should match.');
      _(expected).each(function(d){
        test.ok(_(bazAfter.dependencies).contains(d),'Dependencies should contain '+d);
      });
      callback();
    }
  ],
  function(err, result){
    backend.clear(function(err){
      test.done();
    });
  });
}


function load(scriptName,callback){
  readTestData(scriptName,function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      backend.createScript(function(err, scriptId){
        backend.createRevision(scriptId, revision, function(err, revNum){
          callback(err, scriptId, revNum);
        });
      });
    });
  });
}

exports.testAppCompilation = function(test) {
  async.waterfall([
    function(callback){
      load('math',callback);
    },
    function(scriptId, revNum, callback){
      load('increment',callback);
    },
    function(scriptId, revNum, callback){
      load('minimalHTML',callback);
    },
    function(scriptId, revNum, callback){
      load('incrementTest',callback);
    },
    function(scriptId, revNum, callback){
      test.equal(scriptId, 4 , "Fourth Script id should be 4, it is "+scriptId);
      test.equal(revNum, 1 , "First revNum should be 1, it is "+revNum);

      //TODO test dependencyManagement.compileAppCode(revision, callback(code))
      
      callback();
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
