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

exports.testGetLatestRevisionByName = function(test) {
  var revision = {name:'foo'};
  var scriptId;
  async.waterfall([
    db.createScript,
    function(newScriptId, callback){
      scriptId = newScriptId;
      db.createRevision(scriptId, revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      
      db.getLatestRevisionByName('foo',function(err, latestScriptId, latestRevNum){
        test.equal(revNum, latestRevNum, "revNum should match");
        test.equal(scriptId, latestScriptId, "scriptId should match");
        
        revision.name = 'bar';
        db.createRevision(scriptId, revision, callback);
      });
    },
    function(revNum, callback){
      db.getLatestRevisionByName('bar',function(err, latestScriptId, latestRevNum){
        test.equal(revNum, latestRevNum, "revNum should match");
        test.equal(scriptId, latestScriptId, "scriptId should match");
        callback(null);
      });
    }],
    function(err){
      db.clear(function(err){
        db.disconnect();
        test.done();
      });
    }
  );
};
