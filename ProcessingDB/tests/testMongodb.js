var db = require('../modules/backend/mongodb');
var backendFunctions = require('./backendFunctions');
var async = require('async');

// Use a test DB so as not to interfere with a production DB 
db.setDbName('ProcessingDBTest');

/**
 * Tests incrementing script ids.
 */
exports.testCreateScript = function(test) {
  backendFunctions.testCreateScript(db,test);
};

exports.testRevisionWriteRead = function(test) {
  backendFunctions.testRevisionWriteRead(db, test);
};

exports.testRevisionValidation = function(test) {
  var revision = backendFunctions.createTestRevision();
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
      revision = backendFunctions.createTestRevision();
      delete revision.commitMessage;
      db.createRevision(scriptId, revision, function(err, revNum){
        test.equal(err, "commitMessage is null." , "Null commitMessage should cause error.");
        callback();
      });
    },
    // TODO test validation for all fields
    function(callback){
      db.clear(callback);
    },
    function(callback){
      db.disconnect();
      test.done();
    }
  ]);
};
