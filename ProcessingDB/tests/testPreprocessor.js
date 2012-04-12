var preprocessor = require('../modules/preprocessor');
var fs = require('fs');
var _ = require('underscore');

/**
 * Reads the file './testData/'+scriptName+'.txt'.
 * callback(err, content);
 */
function readTestData(scriptName, callback){
  fs.readFile('./testData/'+scriptName+'.txt', 'ascii', callback);
}

/**
 * Tests extraction of the '@module moduleName' directive.
 */
exports.testModulePreprocessing = function(test) {
  readTestData('math',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      test.equal(revision.type, 'module' , 'Type should be module.');
      test.equal(revision.name, 'math' , 'Name should be math.');
      test.done();
    });
  });
};

/**
 * Tests extraction of the '@template templateName' directive.
 */
exports.testTemplatePreprocessing = function(test) {
  readTestData('minimalHTML',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      test.equal(revision.type, 'template' , 'Type should be template.');
      test.equal(revision.name, 'minimalHTML' , 'Name should be minimalHTML.');
      test.done();
    });
  });
};

/**
 * Tests extraction of '@app property value' directive.
 */
/*exports.testTemplatePreprocessing = function(test) {
  readTestData('ChaosGame',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      
    /*  @app template canvas
@app name Chaos Game
@app width 257
@app height 257*/
/*
      test.equal(revision.type, 'app' , 'Type should be template.');
      test.equal(revision.properties., 'minimalHTML' , 'Name should be minimalHTML.');
      test.done();
    });
  });
};*/

/**
 * Tests extraction of the require('moduleName') directive.
 */
exports.testModuleDependencyPreprocessing = function(test) {
  readTestData('increment',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      test.equal(revision.type, 'module' , 'Type should be module.');
      test.equal(revision.name, 'increment' , 'Name should be increment.');
      test.equal(revision.dependencies[0], 'math', 'Math should be the only dependency');
      
      //This tests for parsing both quote styles: require('foo') and require("foo")
      readTestData('multipleDependencies',function(err,content){
        preprocessor.parseContent(content, function(err, revision){
          test.equal(revision.type, 'module' , 'Type should be module.');
          test.equal(revision.name, 'multipleDependencies' , 'Name should be multipleDependencies.');
          test.equal(revision.dependencies.length, 6, 'There should be six dependencies.');
          var expectedDependencies = [ 'foo', 'bar', 'baz', 'zoo', 'zar', 'zaz' ];
          var difference = _.difference(revision.dependencies,expectedDependencies);
          test.equal(difference.length, 0, 'Dependencies should match.');
          //console.log(revision.dependencies);
          test.done();
        });
      });
    });
  });
};

//TODO test errors for multiple type declarations

