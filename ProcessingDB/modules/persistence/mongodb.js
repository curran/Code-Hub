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
  scriptId: Number,
  revNum: Number,
  commitMessage: String,
  commitDate: Date,
  
  // for tracking branching
  parentRevision: {
    scriptId: Number,
    revNum: Number
  },
  
  type: String, // in ['module','app','template']
  
  // relevant when (type == 'module' || type == 'template')
  name: String,
  
  // relevant when type == 'module'
  // contains direct dependencies by module name
  moduleDependencies: [String],
  
  // relevant when type == 'app'
  // contains all transitive dependencies
  appDependencies: [RevisionPointers],
  
  // relevant when type == 'app'
  template: {
    scriptId: Number,
    revNum: Number
  }
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

// creates a new script
// callback(err, scriptId)
exports.createScript = function(callback){
  incrementCounter('Script',callback);
};

// Clears all database content
exports.clearDB = function(callback){
  Script.remove({},function(){
    Counter.remove({},callback);
  });
}

// Disconnects from MongoDB so the Node process can end.
exports.disconnect = function(){
  mongoose.disconnect();
}

exports.setDbName = function(newDbName){
  dbName = newDbName;
}

