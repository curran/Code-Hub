var preprocessor = require('../modules/preprocessor');
var readTestData = require('./testData/readTestData');
var _ = require('underscore');

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
exports.testTemplatePreprocessing = function(test) {
  readTestData('ChaosGame',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      test.equal(revision.type, 'app' , 'Type should be template.');
      test.equal(revision.template, 'canvas' , 'template should be canvas.');
      
      test.equal(revision.properties.name, 'The  Chaos  Game' , 'Name should be "The  Chaos  Game".');
      test.equal(revision.properties.width, 257 , 'width should be 257.');
      test.equal(revision.properties.height, 257 , 'width should be 257.');
      
      test.done();
    });
  });
};

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

