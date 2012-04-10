var db = require('../modules/persistence/mongodb');
var async = require('async');

db.setDbName('ProcessingDB-Test');

/**
 * Tests incrementing script ids.
 */
exports.testCreateScript = function(test) {
  async.waterfall([
    db.createScript,
    function(scriptId, callback){
      test.equal(scriptId, 1 , "First Script id should be 1");
      db.createScript(callback);
    },
    function(scriptId, callback){
      test.equal(scriptId, 2 , "Second Script id should be 2");
      db.createScript(callback);
    },
    function(scriptId, callback){
      test.equal(scriptId, 3 , "Third Script id should be 3");
      db.clearDB(callback);
    },
    function(callback){
      test.done();
    }
  ]);
};

exports.testRevisionWriteRead = function(test) {
  var revision = {
    commitMessage: "Test Commit Message",
    commitDate: new Date(2012, 4, 9),
    parentRevision: "",
    type: 'template',
    name: 'TestTemplate',
    dependencies: "",
    template: ""
  };
  async.waterfall([
    db.createScript,
    function(scriptId, callback){
      test.equal(scriptId, 1 , "First Script id should be 1");
      revision.scriptId = scriptId;
      db.createRevision(revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      db.createRevision(revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 2 , "Second revNum should be 2");
      var scriptId = 1;
      db.getRevision(scriptId, revNum, function(err, revisionFromDB){
        test.equal(revision.scriptId, revisionFromDB.scriptId , "scriptId should match");
        test.equal(revNum, revisionFromDB.revNum , "revNum should match");
        test.equal(revision.commitMessage , revisionFromDB.commitMessage , "commitMessage  should match");
        test.equal(revision.commitDate.toString() , revisionFromDB.commitDate.toString() , "commitDate  should match");
        test.equal(revision.parentRevision , revisionFromDB.parentRevision , "parentRevision  should match");
        test.equal(revision.type , revisionFromDB.type , "type  should match");
        test.equal(revision.name , revisionFromDB.name , "name  should match");
        test.equal(revision.dependencies , revisionFromDB.dependencies , "dependencies  should match");
        test.equal(revision.template , revisionFromDB.template , "template  should match");
        db.clearDB(callback);
      });
    },
    function(callback){
      db.disconnect();
      test.done();
    }
  ]);
};
