var model = require('../modules/model');
var modelFunctions = require('./modelFunctions');
var async = require('async');

// Use a test model so as not to interfere with a production model.
model.setModelName('Test');

/**
 * Tests incrementing script ids.
 */
exports.testCreateScript = function(test) {
  modelFunctions.testCreateScript(model,test);
};

/**
 * Tests creating new revisions and reading their
 * metadata from MongoDB and their content from git.
 */
exports.testRevisionWriteRead = function(test){
  modelFunctions.testRevisionWriteRead(model, test);
};

exports.testDisconnect = function(test) {
  model.clear(function(err){
    model.disconnect();
    test.done();
  });
};