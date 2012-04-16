var backend = require('../modules/backend');
var testData = require('./testData');
var async = require('async');

var prefix = 'compilationUnitTest/';
/**
 * Tests app compilation.
 */
exports.testLookup = function(test) {
  async.waterfall([
    function(callback){
      testData.load(prefix+'A',callback);
    },
    function(scriptId, revNum, callback){
      testData.load(prefix+'B',callback);
    },
    function(scriptId, revNum, callback){
      testData.load(prefix+'C',callback);
    },
    function(scriptId, revNum, callback){
      testData.load(prefix+'D',callback);
    },
    function(scriptId, revNum, callback){
      backend.compileApp(scriptId, revNum, function(err, compiledApp){
        if(err)
          console.log("Error: "+err);
        test.ok(!err,"Should be no error");
        
        //console.log("compiledApp = *"+compiledApp+"*");
        
        eval(compiledApp);
        test.equal(C(), 12, "Compiled code should work");
        
        callback();
      });
    }
  ],
  function (err, result) {
    if(err) throw err;
    test.done();
  });
};

exports.testDisconnect = function(test) {
  backend.clearModel(function(err){
    backend.disconnect();
    test.done();
  });
};
