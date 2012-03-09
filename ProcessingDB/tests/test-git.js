var git = require('../modules/persistence/git');
var async = require('async');

exports.testRepoDirCreate = function(test) {
  async.waterfall([
    git.repoDirExists, 
    function(exists, callback) {
      test.ok(!exists, "Repo dir should not exist initially.");
      git.createRepoDir(callback);
    }, 
    git.repoDirExists,
    function(exists, callback) {
      test.ok(exists, "Repo dir should exist now.");
      git.deleteRepoDir(callback);
      test.done();
    }
  ]);
};

exports.testSetGetContent = function(test){
  function testGet(repoId, revNum, testContent, callback){
    git.getContent(repoId, revNum, function(err, content){
      test.equal(testContent, content, "get() should match set() content");
      callback();
    });
  }
  
  function testSetGet(repoId, revNum, testContent, callback){
    git.setContent(repoId, revNum, testContent, function(err){
      testGet(repoId, revNum, testContent, callback)
    });
  }
  
  
  async.waterfall([
    function(callback) {
      testSetGet('1','1','Test Content 1.1', callback);
    },
    function(callback) {
      testSetGet('1','2','Test Content 1.2', callback);
    },
    function(callback) {
      testGet('1','1','Test Content 1.1', callback);
    },
    function(callback) {
      test.done();
    }
  ]);
};

exports.testRepoDirDelete = function(test) {
  git.repoDirExists(function(err, exists) {
    test.ok(!exists, "Repo dir should no longer exist.");
    test.done();
  });
};
