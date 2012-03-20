var git = require('../modules/persistence/git');
var async = require('async');

exports.testReposDirCreate = function(test) {
  async.waterfall([
    git.reposDirExists, 
    function(exists, callback) {
      test.ok(!exists, "Repo dir should not exist initially.");
      git.ensureReposDirExists(callback);
    }, 
    git.reposDirExists,
    function(exists, callback) {
      test.ok(exists, "Repo dir should exist now.");
      test.done();
    }
  ]);
};

// exports.testGetErrors = function(test){
  // // test that errors are properly emitted when a script or revision does not exist
  // var scriptId = 2, revNum = 4; // nonexistant
  // git.getContent(scriptId, revNum, function(err, content){
    // test.equal(err, "No script exists with id "+scriptId, "Request for nonexistent script id should pass an error.");
    // callback(null);
  // });
// }

exports.testSetGetContent = function(test){
  function testGet(scriptId, revNum, testContent){
    return function(callback){
      git.getContent(scriptId, revNum, function(err, content){
        test.equal(testContent, content, "get() should match set() content");
        callback(null);
      });
    }
  }
  
  function testSetGet(scriptId, revNum, testContent){
    return function(callback){
      git.setContent(scriptId, revNum, testContent, function(err){
        testGet(scriptId, revNum, testContent)(callback);
      });
    };
  }
  
  async.series([
    // Test serial execution
    testSetGet('1','1','Test Content 1.1'),
    testSetGet('1','2','Test Content 1.2'),
    testSetGet('2','1','Test Content 2.1'),
    testSetGet('2','2','Test Content 2.2'),
    testGet('1','1','Test Content 1.1'),
    testGet('2','1','Test Content 2.1'),
    function(callback) {
      // Test parallel execution which would
      // break if a queue were not used.
      async.parallel(
        [
          testSetGet('3','1','Test Content 3.1'),
          testSetGet('3','2','Test Content 3.2'),
          testSetGet('4','1','Test Content 4.1'),
          testSetGet('4','2','Test Content 4.2')
        ], callback
      );
    },
    testGet('3','1','Test Content 3.1'),
    testGet('4','1','Test Content 4.1'),
    function() { test.done(); }
  ]);
}

exports.testReposDirDelete = function(test) {
  git.deleteReposDir(function(){
    git.reposDirExists(function(err, exists) {
      test.ok(!exists, "Repo dir should no longer exist.");
      test.done();
    });
  });
};
