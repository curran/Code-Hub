var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var strings = require('./strings');
var _ = require('underscore');

// The name of the MongoDB database
// May be changed for unit testing.
var dbName = 'codehub';

var Counters = new Schema({
  _id:String, // the schema name
  count: Number
});

var revisionSchemaDescriptor = {
  _id: String, // scriptId.revNum
  commitMessage: String,//TODO track this
  commitDate: Date,
  parentRevision: String, // "scriptId.revNum" or "" TODO track this
  type: String, // in ['module','app','template']
  
  // relevant when (type == 'module' || type == 'template')
  name: String,
  
  // relevant when type == 'app' || type == 'module'.
  // contains direct dependencies by module name
  dependencies: [String],
  
  // relevant when type == 'app'.
  // contains transitive dependencies by revision reference
  //   of the form "scriptIdA.revNumA,scriptIdB.revNumB"
  //   e.g. ['4.2','6.3','8.1']
  appDependencies: [String],
  
  // relevant when type == 'app'.
  // Contains app properties to be passed to the template.
  // Entries are of the form "property=value".
  appProperties: [String],
  
  // URLs of external scripts to be included in script tags
  scripts:[String],
  
  // relevant when type == 'app'
  template: String, // "scriptId.revNum" or ""
  
  templateName: String, // the name of the template, for display
  
  templateParameters: [String] // the names of the template parameters. Necessary for validation.
};

var Scripts = new Schema({
  _id: Number, //scriptId
  latestRevNum: Number,
  latestName: String,
  latestDependencies: [String],
  latestTemplateParameters: [String]
});

// var Scripts = new Schema({
  // _id: Number, //scriptId
  // latest: revisionSchemaDescriptor
// });

var Revisions = new Schema(revisionSchemaDescriptor);

var findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

Counters.statics.findAndModify = findAndModify;
Scripts.statics.findAndModify = findAndModify;

mongoose.connect('mongodb://localhost/'+dbName,function(err){
  if(err) throw "Failed to connect to MongoDB. Is mongod running?";
});

var Counter = mongoose.model('Counter', Counters);
var Script = mongoose.model('Script', Scripts);
var Revision = mongoose.model('Revision', Revisions);

/**
 * Upserts and increments, and sets the property:value pair found in setObject.
 * callback(err,incrementedValue)
 */
function incrementAndSet(schema, fieldToIncrement, id, setObject, callback){
  var fieldInc = {};
  fieldInc[fieldToIncrement] = 1;
  var options = { $inc: fieldInc };
  if(setObject)
    options.$set = setObject;
  schema.findAndModify({ _id: id }, [], options, {"new":true, upsert:true},
    function (err, result) {
      if (err) callback(err);
      else callback(null, result[fieldToIncrement]);
    }
  );
}

/**
 * Upserts and increments.
 * callback(err,incrementedValue)
 */
function increment(schema, fieldToIncrement, id, callback){
  incrementAndSet(schema, fieldToIncrement, id, null, callback);
}

/**
 * Creates a new script.
 * Really it just increments the counter.
 * The Script is inserted when the first Revision is made.
 * callback(err, scriptId)
 */
exports.createScript = function(callback){
  increment(Counter,"count", 'Script', callback);
};

/**
 * Clears all database content.
 * callback(err)
 */
exports.clear = function(callback){
  Script.remove({},function(){
    Revision.remove({},function(){
      Counter.remove({},callback);
    });
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
 * Converts scriptId, revNum to the id 
 * form used by Revision._id
 */
function revId(scriptId, revNum){
  return scriptId+'.'+revNum;
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
  if(!revisionObject)
    callback("Revision object is null.");
  else{
    var set = {
      latestName: revisionObject.name,
      latestDependencies: revisionObject.dependencies,
      latestTemplateParameters: revisionObject.templateParameters
    };
    incrementAndSet(Script,"latestRevNum", scriptId, set, function(err, revNum){
      var revisionDoc = new Revision();
      revisionDoc._id = revId(scriptId,revNum);
      _.extend(revisionDoc, revisionObject);
      revisionDoc.save(function(err){
        callback(err,revNum);
      });
    });
  }
};

/**
 * Gets a revision entry from the database.
 * The object passed to the callback is of the same
 * form as the object passed into createRevision.
 * callback(err,revisionFromDB)
 */
exports.getRevision = function(scriptId, revNum, callback){
  Revision.findOne({ _id: revId(scriptId, revNum) }, function(err, revision){
    if(err)
      callback(err);
    else if(!revision)
      callback(strings.revNotFound(scriptId, revNum));
    else
      callback(null, revision);
  });
};
/**
 * Gets the scriptId, revNum, and dependencies for the latest version of the 
 * script with the given name (which is of type 'module' or 'template').
 * callback(err, revision)
 * revision has the following properties:
 *   scriptId
 *   revNum
 *   dependencies
 *   templateParameters
 */
exports.getLatestRevisionByName = function(name, callback){
  Script.findOne({ latestName: name }, function(err, script){
    if(!script)
      callback("No script found with name '"+name+"'.");
    else{
      callback(null,{
        scriptId:script._id,
        revNum:script.latestRevNum, 
        dependencies: script.latestDependencies,
        templateParameters: script.latestTemplateParameters
      });
    }
  });
}

/**
 * Lists all script names.
 * callback(err, scripts:Array<String>)
 */
exports.listScripts = function(callback){
  Script.find({}, function(err, scripts){
    callback(err, 
      _.map(scripts, function(script){
        if(script.latestName)
          return script.latestName;
        else
          return script._id+'.'+script.latestRevNum;
      })
    );
  });
};
