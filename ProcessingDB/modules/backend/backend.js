/**
 * This is the module providing the API to the ProcessingDB backend.
 * All interactions between the ProcessingDB middleware and the backend
 * should take place through this module, to ensure consistency between
 * the Git repositories the MongoDB database which together implement
 * the on-disk ProcessingDB model.
 */
var git = require('./git');
var db = require('./mongodb');

/**
 * Sets the name of the Git repositories directory to "./reposModelName"
 * and sets the MongoDB database name to "ProcessingDBModelName"
 * where "ModelName" is the argument passed to this function.
 * This is useful for unit testing.
 */
exports.setModelName = function(modelName){
  git.setReposDir('./repos'+modelName);
  db.setDbName('ProcessingDB'+modelName);
}

exports.createScript = db.createScript;