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
  var revision = {name:'foo', dependencies:['a','b']};
  var scriptId;
  async.waterfall([
    db.createScript,
    function(newScriptId, callback){
      scriptId = newScriptId;
      db.createRevision(scriptId, revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      
      db.getLatestRevisionByName('foo',function(err, revision){
        test.equal(scriptId, revision.scriptId, "scriptId should match");
        test.equal(revNum, revision.revNum, "revNum should match");
        test.equal(revision.dependencies.length, 2, "should have 2 dependencies");
        
        revision.name = 'bar';
        revision.dependencies.push('c');
        db.createRevision(scriptId, revision, callback);
      });
    },
    function(revNum, callback){
      db.getLatestRevisionByName('bar',function(err, revision){
        test.equal(scriptId, revision.scriptId, "scriptId should match");
        test.equal(revNum, revision.revNum, "revNum should match");
        test.equal(revision.dependencies.length, 3, "should have 3 dependencies");
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
