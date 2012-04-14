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
    name: 'bar',
    dependencies:[]
  };
  var baz = {
    type: 'module',
    name: 'baz',
    dependencies: ['foo','bar']
  };
  var a = {
    type: 'app',
    name: 'a',
    dependencies: ['baz']
  };
    
  var zoo = {
    type: 'module',
    name: 'zoo',
    dependencies: ['foo']
  }
  
  var b = {
    type: 'app',
    name: 'b',
    dependencies: ['baz', 'zoo']
  };
  
  var c = {
    type: 'app',
    name: 'c',
    dependencies: ['unknownModule']
  }
  
  // Dependency graph:
  // (edges directed bottom to top)
  // bar  foo
  //  \   / \
  //   baz  zoo  unknownModule
  //    | \ /         |
  //    a  b          c
  
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
  
  function assertSetsEqual(expected, actual){
    test.equal(actual.length, expected.length, 'Number of dependencies should match.');
    _(expected).each(function(d){
      test.ok(_(actual).contains(d),'Dependencies should contain '+d);
    });
  }
  
  async.waterfall([
    // Test direct dependency lookup
    function(callback){ loadRevision(foo, callback);  },
    function(callback){ loadRevision(bar, callback);  },
    function(callback){ loadRevision(baz, callback);  },
    function(callback){ loadRevision(a, callback);  },
    function(callback){ loadRevision(zoo, callback);  },
    function(callback){ loadRevision(b, callback);  },
    
    function(callback){
      dependencyManagement.lookupDependencies(baz, callback);
    },
    function(bazAfter, callback){
      assertSetsEqual(_.map([foo,bar], id), bazAfter.dependencies);
      callback();
    },
    
    // Test recursive dependency lookup
    function(callback){ dependencyManagement.lookupDependencies(a, callback); },
    function(aAfter, callback){
      assertSetsEqual(_.map([foo,bar,baz], id), aAfter.dependencies);
      callback();
    },
    
    //    foo
    //    / \
    // baz  zoo
    //    \ /
    //     b
    // Test that foo is included only once.
    function(callback){ dependencyManagement.lookupDependencies(b, callback); },
    function(aAfter, callback){
      assertSetsEqual(_.map([foo,bar,baz,zoo], id), aAfter.dependencies);
      callback();
    },

    // Test for correct behavior when the revision has dependencies == null
    function(callback){ dependencyManagement.lookupDependencies(foo, callback); },
    function(fooAfter, callback){
      test.ok(fooAfter.dependencies == null, "Should have dependencies == null.");
      callback();
    },
    
    // Test for correct behavior when the revision has dependencies == []
    function(callback){ dependencyManagement.lookupDependencies(bar, callback); },
    function(barAfter, callback){
      test.equal(barAfter.dependencies.length, 0, "Should have dependencies.length == 0.");
      callback();
    },
    
    //Test for error when a dependency is not found
    function(callback){
      dependencyManagement.lookupDependencies(c, function(err,cAfter){
        test.equal(err, "No script found with name 'unknownModule'.","Should give error for not found module.");
        callback();
      });
    }
  ],
  function(err, result){
    if(err) throw err;
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
/*
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
*/
exports.testDisconnect = function(test) {
  backend.clear(function(err){
    backend.disconnect();
    test.done();
  });
};
