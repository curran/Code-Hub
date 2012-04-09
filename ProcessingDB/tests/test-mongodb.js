var db = require('../modules/persistence/mongodb');
var testDbName = 'ProcessingDB-Test';

exports.testCreateScript = function(test) {
  db.setDbName(testDbName);
  db.createScript(function(err, scriptId){
    if(err){
      console.log(err);
      test.fail();
    }
    test.equal(scriptId, 1 , "First Script id should be 1");
    db.createScript(function(err, scriptId){
      test.equal(scriptId, 2 , "Second Script id should be 2");
      db.createScript(function(err, scriptId){
        test.equal(scriptId, 3 , "Third Script id should be 3");
        db.clearDB(function(err){
          db.disconnect();
          test.done();
        });
      });
    });
  });
};