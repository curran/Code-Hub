var preprocessor = require('../modules/preprocessor');
var testData = require('./testData');
var _ = require('underscore');
var strings = require('../modules/strings');

/**
 * Tests extraction of the '@module moduleName' directive.
 */
exports.testModulePreprocessing = function(test) {
  testData.read('math',function(err,content){
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
  testData.read('minimalHTML',function(err,content){
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
  testData.read('ChaosGame',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      test.equal(revision.type, 'app' , 'Type should be template.');
      test.equal(revision.templateName, 'canvas' , 'template should be canvas.');
      
      test.ok(_(revision.appProperties).contains('name=The  Chaos  Game'), 'Name should be "The  Chaos  Game".');
      test.ok(_(revision.appProperties).contains('width=257'), 'width should be 257.');
      test.ok(_(revision.appProperties).contains('height=257'), 'height should be 257.');
      
      test.done();
    });
  });
};

/**
 * Tests extraction of the require('moduleName') directive.
 */
exports.testModuleDependencyPreprocessing = function(test) {
  testData.read('increment',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      test.equal(revision.type, 'module' , 'Type should be module.');
      test.equal(revision.name, 'increment' , 'Name should be increment.');
      test.equal(revision.dependencies[0], 'math', 'Math should be the only dependency');
      
      //This tests for parsing both quote styles: require('foo') and require("foo")
      testData.read('multipleDependencies',function(err,content){
        preprocessor.parseContent(content, function(err, revision){
          test.equal(revision.type, 'module' , 'Type should be module.');
          test.equal(revision.name, 'multipleDependencies' , 'Name should be multipleDependencies.');
          test.equal(revision.dependencies.length, 6, 'There should be six dependencies.');
          var expected = [ 'foo', 'bar', 'baz', 'zoo', 'zar', 'zaz' ];
          test.equal(revision.dependencies.length, expected.length, 'Number of dependencies should match.');
          _(expected).each(function(d){
            test.ok(_(revision.dependencies).contains(d),'Dependencies should contain '+d);
          });
          
          // var intersection = _.intersection(expected, revision.dependencies);
          // test.equal(intersection.length, expected.length, 'Dependencies should match.');
          //console.log(revision.dependencies);
          test.done();
        });
      });
    });
  });
};

/**
 * Tests ignoring directives within comments.
 */
exports.testIgnoreComments = function(test) {
  var s = "outside//inside\noutside1\n//inside2\noutside2";
  test.equal(preprocessor.removeComments(s), "outside\noutside1\n\noutside2",'regex should work');
  s = "outside/*inside*/outside1";
  test.equal(preprocessor.removeComments(s), "outsideoutside1",'regex should work');
  
  s = 'out/*in*/out';
  test.equal(preprocessor.removeComments(s),'outout','regex should work');
  s = 'out/**in*/out';
  test.equal(preprocessor.removeComments(s),'outout','regex should work');
  s = 'out/*****in*/out';
  test.equal(preprocessor.removeComments(s),'outout','regex should work');
  s = 'out/*****in*****/out';
  test.equal(preprocessor.removeComments(s),'outout','regex should work');
  s = 'out/*****in\n*****/out';
  test.equal(preprocessor.removeComments(s),'outout','regex should work');
  s = 'out/*****in\n * test \n * hdasfdsaf\n*****/out';
  test.equal(preprocessor.removeComments(s),'outout','regex should work');
  s = 'out/*****in\n * test \n * hdasfdsaf\n*****/out1 /*in*/out3';
  test.equal(preprocessor.removeComments(s),'outout1 out3','regex should work');
  
  testData.read('directiveInComments',function(err,content){
    preprocessor.parseContent(content, function(err, revision){
      if(err)
        throw err;
      test.ok(!err,'Should be no error');
      test.equal(revision.type, 'module' , 'Type should be module.');
      test.equal(revision.name, 'test' , 'Name should be test.');
      test.equal(revision.dependencies.length, 0, 'should have no dependencies');
      test.done();
    });
  });
};

/**
 * Tests errors for multiple type declarations.
 */
exports.testMultipleTypesError = function(test) {
  testData.read('multipleTypes',function(err,content){
    
    preprocessor.parseContent(content, function(err, revision){
      test.equal(err,strings.multipleTypes('app','module'));
      test.done();
    });
  });
};

//TODO test that each dependency is only included once even if there are multiplt require() statements

