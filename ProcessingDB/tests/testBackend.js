var backend = require('../modules/backend/backend');
var backendFunctions = require('./backendFunctions');
var async = require('async');

// Use a test model so as not to interfere with a production model.
backend.setModelName('Test');

/**
 * Tests incrementing script ids.
 */
exports.testCreateScript = function(test) {
  backendFunctions.testCreateScript(backend,test);
};

/**
 * Tests creating new revisions and reading their
 * metadata from MongoDB and their content from git.
 */
exports.testRevisionWriteRead = function(test){
  backendFunctions.testRevisionWriteRead(backend, test);
  //test.done();
};

exports.testDisconnect = function(test) {
  backend.clear(function(err){
    backend.disconnect();
    test.done();
  });
};