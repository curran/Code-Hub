var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// The name of the MongoDB database
// May be changed for unit testing.
var dbName = 'processingDB';

var Scripts = new Schema({
  scriptId: Number,
  latestRevNum: Number
});

var Counters = new Schema({
  _id:String, // the schema name
  count: Number
});

// TODO emit error when no connection made
mongoose.connect('mongodb://localhost/'+dbName,function(err){
  if(err)
    throw "Failed to connect to MongoDB. Is mongod running?";
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
  // TODO fix this so it is just one atomic db call
  Counter.update({ _id: schemaName }, { $inc: {count: 1 } },
                 { upsert: true }, function(err, counter){
    if(err)
      callback(err);
    else
      Counter.findOne({ _id: schemaName }, function(err, counter){
        if(err)
          callback(err);
        else
          callback(null, counter.count.valueOf());
      });
  });
}

// creates a new script
// callback(err, scriptId)
function createScript(callback){
  incrementCounter('Script',callback);
}

exports.createScript = createScript;

// var RevisionPointers = new Schema({
  // scriptId: Number,
  // revNum: Number
// });
// 
// var Revisions = new Schema({
  // scriptId: Number,
  // revNum: Number,
  // commitMessage: String,
  // commitDate: Date,
  // // from whence this came, for tracking branching
  // parentRevision: {
    // scriptId: Number,
    // revNum: Number
  // },
  // type: String, // in ['module','app','template']
//   
  // // relevant when (type == 'module' || type == 'template')
  // name: String,
//   
  // // relevant when (type == 'app' || type == 'module')
  // dependencies: [RevisionPointers],
//   
  // // relevant when type == 'app'
  // template: {
    // scriptId: Number,
    // revNum: Number
  // }
// });