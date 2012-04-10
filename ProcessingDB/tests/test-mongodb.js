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
function createRevision(){
  return {
    commitMessage: "Test Commit Message",
    commitDate: new Date(2012, 4, 9),
    parentRevision: "",
    type: 'template',
    name: 'TestTemplate',
    dependencies: "",
    template: ""
  };
}
var revision = createRevision();

exports.testRevisionWriteRead = function(test) {
  var scriptId;
  async.waterfall([
    db.createScript,
    function(newScriptId, callback){
      scriptId = newScriptId;
      test.equal(scriptId, 1 , "First Script id should be 1");
      db.createRevision(scriptId, revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      db.createRevision(scriptId, revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 2 , "Second revNum should be 2");
      db.getRevision(scriptId, revNum, function(err, revisionFromDB){
        test.equal(revision.commitMessage , revisionFromDB.commitMessage , "commitMessage  should match");
        test.equal(revision.commitDate.toString() , revisionFromDB.commitDate.toString() , "commitDate  should match");
        test.equal(revision.parentRevision , revisionFromDB.parentRevision , "parentRevision  should match");
        test.equal(revision.type , revisionFromDB.type , "type  should match");
        test.equal(revision.name , revisionFromDB.name , "name  should match");
        test.equal(revision.dependencies , revisionFromDB.dependencies , "dependencies  should match");
        test.equal(revision.template , revisionFromDB.template , "template  should match");
        test.done();
      });
    }
  ]);
};

exports.testRevisionValidation = function(test) {
  var scriptId;
  async.waterfall([
    db.createScript,
    function(newScriptId, callback){
      scriptId = newScriptId;
      db.createRevision(scriptId, revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      
      db.createRevision(scriptId, null, function(err, revNum){
        test.equal(err, "Revision object is null." , "Null revision should cause error.");
        callback();
      });
    },
    function(callback){
      revision = createRevision();
      delete revision.commitMessage;
      db.createRevision(scriptId, revision, function(err, revNum){
        test.equal(err, "commitMessage is null." , "Null commitMessage should cause error.");
        callback();
      });
    },
    // TODO test validation for all fields
    function(callback){
      db.clearDB(callback);
    },
    function(callback){
      db.disconnect();
      test.done();
    }
  ]);
};
