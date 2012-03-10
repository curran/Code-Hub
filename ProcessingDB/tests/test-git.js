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

exports.testSetGetContent = function(test){
  function testGet(repoId, revNum, testContent){
    return function(callback){
      git.getContent(repoId, revNum, function(err, content){
        test.equal(testContent, content, "get() should match set() content");
        callback();
      });
    }
  }
  
  function testSetGet(repoId, revNum, testContent){
    return function(callback){
      git.setContent(repoId, revNum, testContent, function(err){
        testGet(repoId, revNum, testContent)(callback);
      });
    };
  }
  
  async.series([
    testSetGet('1','1','Test Content 1.1'),
    testSetGet('1','2','Test Content 1.2'),
    testSetGet('2','1','Test Content 2.1'),
    testSetGet('2','2','Test Content 2.2'),
    testGet('1','1','Test Content 1.1'),
    testGet('2','1','Test Content 2.1'),
    function(callback) {
      test.done();
    }
  ]);
};

exports.testReposDirDelete = function(test) {
  git.deleteReposDir(function(){
    git.reposDirExists(function(err, exists) {
      test.ok(!exists, "Repo dir should no longer exist.");
      test.done();
    });
  });
};
