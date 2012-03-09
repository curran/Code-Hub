var git = require('../modules/git');
var async = require('async');

exports.testRepoDirFns = function(test) {
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
    }, 
    git.repoDirExists,
    function(exists, callback) {
      test.ok(!exists, "Repo dir should no longer exist.");
      test.done();
    }
  ]);
};

exports.testCreateRepo