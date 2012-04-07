var db = require('../modules/persistence/mongodb');

exports.testCreateScript = function(test) {
  db.createScript(function(err, scriptId){
    console.log('here');
    test.equal(scriptId, 1 , "First Script id should be 1");
    db.clearDB(function(){
      test.done();
    });
  });
};