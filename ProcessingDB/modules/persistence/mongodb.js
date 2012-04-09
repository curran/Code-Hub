var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// The name of the MongoDB database
// May be changed for unit testing.
var dbName = 'processingDB';

var Counters = new Schema({
  _id:String, // the schema name
  count: Number
});

var Scripts = new Schema({
  _id: Number, //scriptId
  latestRevNum: Number
});

var RevisionPointers = new Schema({
  scriptId: Number,
  revNum: Number
});

var Revisions = new Schema({
  _id: String, // scriptId.revNum
  commitMessage: String,
  commitDate: Date,
  parentRevision: String, // "scriptId.revNum" or ""
  type: String, // in ['module','app','template']
  
  // relevant when (type == 'module' || type == 'template')
  name: String,
  
  // relevant when type == 'module' or type == 'app'
  // if 'module', contains direct dependencies by module name
  //   of the form "moduleA,moduleB,moduleC"
  // if 'app', contains transitive dependencies by revision id
  //   of the form "scriptIdA.revNumA,scriptIdB.revNumB"
  //   e.g. "4.2,6.3,8.1"
  // or "" for no dependencies or if type == 'template'
  dependencies: String,
  
  // relevant when type == 'app'
  template: String // "scriptId.revNum" or ""
});

Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

mongoose.connect('mongodb://localhost/'+dbName,function(err){
  if(err) throw "Failed to connect to MongoDB. Is mongod running?";
});

var Counter = mongoose.model('Counter', Counters);

var Script = mongoose.model('Script', Scripts);

/**
 * Increments the counter associated with the given schema name.
 * @param {string} schemaName The name of the schema for which to
 *   increment the associated counter.
 * @param {function(err, count)} The callback called with the updated
 *   count (a Number).
 */
function incrementCounter(schemaName, callback){
  Counter.findAndModify({ _id: schemaName }, [], 
    { $inc: { count: 1 } }, {"new":true, upsert:true}, function (err, result) {
      if (err)
        callback(err);
      else
        callback(null, result.count);
  });
}

/**
 * Creates a new script.
 * callback(err, scriptId)
 */
exports.createScript = function(callback){
  incrementCounter('Script',callback);
};

/**
 * Clears all database content.
 * callback(err)
 */
exports.clearDB = function(callback){
  Script.remove({},function(){
    Counter.remove({},callback);
  });
}

/**
 * Disconnects from MongoDB so the Node process can end.
 * For unit testing.
 */
exports.disconnect = function(){
  mongoose.disconnect();
}

/**
 * Sets the name of the MongoDB database to be used.
 * For unit testing.
 */
exports.setDbName = function(newDbName){
  dbName = newDbName;
}
/**
 * Creates a new revision.
 * @param {scriptId} The id of the script for which to 
 *   create the new revision.
 * @param {revisionObject} The content to be persisted,
 *   expected to contain the following fields:
 *  - scriptId
 *  - revNum
 *  - commitMessage: String
 *  - commitDate: Date,
 *  - parentRevision: String, "scriptId.revNum" or ""
 *  - type: String, // in ['module','app','template']
 *  - name: String,
 *    relevant when (type == 'module' || type == 'template')
 *  - dependencies: String,
 *    relevant when type == 'module' or type == 'app'
 *    if 'module', contains direct dependencies by module name
 *      of the form "moduleA,moduleB,moduleC"
 *    if 'app', contains transitive dependencies by revision id
 *      of the form "scriptIdA.revNumA,scriptIdB.revNumB"
 *      e.g. "4.2,6.3,8.1"
 *    or "" for no dependencies or if type == 'template'
 *  - template: String // "scriptId.revNum" or ""
 *    relevant when type == 'app'
 * @param callback(err, revNum) Passes the new revision number
 */
exports.createRevision = function(scriptId, revisionObject, callback){
  
}
