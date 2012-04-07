var db = require('../modules/persistence/mongodb');

exports.testCreateScript = function(test) {
  db.createScript(function(err, scriptId){
    console.log('here');
    test.equal(scriptId, 1 , "First Script id should be 1");
    //test.done();
    db.clearDB(function(err){
      db.disconnect();
      test.done();
    });
  });
};