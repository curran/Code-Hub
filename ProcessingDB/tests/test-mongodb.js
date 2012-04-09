var db = require('../modules/persistence/mongodb');
var async = require('async');

db.setDbName('ProcessingDB-Test');

/**
 * Tests incrementing script ids.
 */
exports.testCreateScript = function(test) {
  async.waterfall([
    // db.clearDB,
    // function(callback){
      // db.createScript(callback);
    // },
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
  var revisionObject = {
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
      revisionObject.scriptId = scriptId;
      db.createRevision(revisionObject, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      db.createRevision(revisionObject, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 2 , "Second revNum should be 2");
      db.clearDB(callback);
    },
    function(callback){
      db.disconnect();
      test.done();
    }
  ]);
};