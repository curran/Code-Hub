var preprocessor = require('../modules/preprocessor');
var fs = require('fs');

/**
 * Reads the file './testData/'+scriptName+'.txt'.
 * callback(err, content);
 */
function readTestData(scriptName, callback){
  fs.readFile('./testData/'+scriptName+'.txt', 'ascii', callback);
}

/**
 * Tests extraction of the @module moduleName directive.
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

