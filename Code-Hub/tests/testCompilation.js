var backend = require('../modules/backend');
var testData = require('./testData');
var async = require('async');

var prefix = 'compilationUnitTest/';

exports.clearModel = function(test) {
  backend.clearModel(function(err){
    test.done();
  });
};

function stripScriptTags(string){
  return string.replace('<script>','').replace('</script>','');
}

/**
 * Tests app compilation.
 */
exports.testAppCompilation = function(test) {
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
        
        compiledApp = stripScriptTags(compiledApp);
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

/**
 * Tests injecting parameters into templates from apps.
 */
exports.testAppParameterInjection = function(test) {
  async.waterfall([
    function(callback){
      testData.load(prefix+'E',callback);
    },
    function(scriptId, revNum, callback){
      testData.load(prefix+'F',callback);
    },
    function(scriptId, revNum, callback){
      backend.compileApp(scriptId, revNum, function(err, compiledApp){
        compiledApp = stripScriptTags(compiledApp);
        eval(compiledApp);
        test.equal(E(), 15, "Compiled code should work");
        callback();
      });
    }
  ],
  function (err, result) {
    if(err) throw err;
    test.done();
  });
};

/**
 * Tests that the require library is not included when there are no require() statements.
 */
exports.testOmitRequireLibrary = function(test) {
  async.waterfall([
    function(callback){
      testData.load(prefix+'G',callback);
    },
    function(scriptId, revNum, callback){
      backend.compileApp(scriptId, revNum, function(err, compiledApp){
        test.equal(compiledApp.indexOf('var require = (function() {'), -1, "Compiled code should not contain the require library.");
        compiledApp = stripScriptTags(compiledApp);
        eval(compiledApp);
        test.equal(E(), 5, "Compiled code should work");
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
    if(err) throw err;
    backend.disconnect();
    test.done();
  });
};
