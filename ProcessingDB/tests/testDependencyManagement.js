/**
 * This unit test tests the following sequence of events:
 *  - Parse and store in the model two modules, a template, and an app.
 *  - Compile the app together with its dependencies
 */
var model = require('../modules/model');
var dependencyManagement = require('../modules/dependencyManagement');
var async = require('async');
var _ = require('underscore');


// Use a test model so as not to interfere with a production model.
model.setModelName('Test');

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
     model.createScript(function(err, scriptId){
      model.createRevision(scriptId, revision, function(err, revNum){
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
    function(callback){
      dependencyManagement.lookupDependencies(foo, callback);
    },
    function(fooAfter, callback){
      test.ok(fooAfter.dependencies == null, "Should have dependencies == null.");
      callback();
    },
    
    // Test for correct behavior when the revision has dependencies == []
    function(callback){
      dependencyManagement.lookupDependencies(bar, callback);
    },
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
    model.clear(function(err){
      test.done();
    });
  });
}

exports.testDisconnect = function(test) {
  model.clear(function(err){
    model.disconnect();
    test.done();
  });
};
