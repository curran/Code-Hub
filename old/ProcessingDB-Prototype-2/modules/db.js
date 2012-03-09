// A module for interacting with a MongoDB 
// store of Script and Revision entries.
//
// API documentation at the bottom of the file.
//
// Author: Curran Kelleher

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var RevisionPointers = new Schema({
  name: String,
  version: Number
});

var Revisions = new Schema({
  name: String,
  version: Number,
  dependencies: [RevisionPointers],
  template: {
    name: String,
    version: Number
  },
  message: {type: String, default:''}
});

var Scripts = new Schema({
  name: String,
  latestVersion: Number
});

mongoose.connect('mongodb://localhost/mydatabase');
var Script = mongoose.model('Script', Scripts);
var Revision = mongoose.model('Revision', Revisions);

function clearDB(callback){
  Revision.remove({},function(){
    Script.remove({},callback);
  });
}

function findAllScripts(callback){
  Script.find({},callback);
}

function findAllRevisions(name, callback){
  Revision.find({ name: name }, callback);
}

function insertNewScript(name, firstVersion, callback){
  // Check first that the script does not already exist
  Script.findOne({ name: name }, function(err, script){
    if(script)
      callback(new Error("The script name \""+name
        +"\" is already taken. Please choose another name."));
    else{
      var script = new Script(), revision = new Revision();
      script.name = revision.name = name;
      script.latestVersion = revision.version = firstVersion;
      script.save(function(err){
        if(err) callback(err);
        else revision.save(callback);
      });
    }
  });
}



function saveRevision(revision, callback){
  var revisionInDB = new Revision();
  revisionInDB.name = revision.name;
  revisionInDB.version = revision.version;
  revisionInDB.message = revision.message;
  revisionInDB.template = revision.template;
  
  for(var i = 0;i<revision.dependencies.length; i++)
    revisionInDB.dependencies.push(revision.dependencies[i]);
 
  //TODO parse occurances of '${code}'
  //TODO report error when '${code}' is present with 
  //     either '@depends on' or '@embed in'
  
  revisionInDB.save(callback);
}

function incrementLatestVersion(name, callback){
  Script.findOne({ name: name }, function(err, script){
    if(err) callback(err);
    else{
      //TODO use strings to always get nice looking versions
      // of the form X+.XX
      script.latestVersion = Math.round(script.latestVersion*100+1)/100.0;
      // script.latestVersion + 0.01 leads to stuff like 0.10999999999999999
      script.save(function(err){
        callback(err, script.latestVersion);
      });
    }
  });
}

function findRevision(name, version, callback){
  Revision.findOne({
    name: name, version: version
  }, function(err, revision){
    if(err)
      callback(err);
    else
      if(revision)
        callback(null, revision.toObject());
      else
        callback('Revision \"'+name+' '+version+'\" not found.');
  });
};

// insertNewScript(name, firstVersion, callback(error))
//
// Inserts a new Script entry into the database with
// the given 'name', then inserts a new Revision entry 
// into the database has the version number 'firstVersion'.
module.exports.insertNewScript = insertNewScript;


// saveRevision(revision, callback(error))
//
// Saves the given 'revision' to the database, which is
// expected to be an object with the following properties:
//  - name:String - The name of the Script to which this
//                  revision belongs.
//  - version:String - The version number of this revision.
//  - message:String - The commit message for this revision
//  - content:String - The code content of this revision,
//                     used only for extracting occurances of
//                     '@depends on', '@embed in', and '${code}'.
//                     The content is not stored in the database.
module.exports.saveRevision = saveRevision;

// incrementLatestVersion(name, callback(error, latestVersion))
//
// Increments the latest version of the Script database entry
// with the given 'name' and passes the new latest version number
// to the callback.
module.exports.incrementLatestVersion = incrementLatestVersion;

// findAllScripts(callback(error, allScripts))
// 
// Finds all Script entries in the database.
// The callback argument 'allScripts' is an array
// of objects which each have the following properties:
//  - name: String - The name of the script
//  - latestVersion: String - The latest version of the script
module.exports.findAllScripts = findAllScripts;

// findAllRevisions(callback(error, allRevisions))
//
// Finds all revisions of the given script. The callback
// argument 'allRevisions' is an array of objects which 
// each have the following properties:
//  - name: String - The name of the Script to which 
//                   this revision belongs.
//  - version: Number - The version of this revision
//  - dependencies: [{name: , version: }] 
//    - The dependencies of this revision, an array of
//      objects referring to Revisions by name and version.
//  - template: {name: , version: } - A reference to the script
//                                    which serves as a template
//                                    for this revision.
//  - message: String - The commit message of this revision.
module.exports.findAllRevisions = findAllRevisions;

// findRevision(name, version, callback(error, revision))
//
// Finds the revision with the given name and version.
// The callback argument 'revision' has:
//  - name: String - The name of the Script to which 
//                   this revision belongs.
//  - version: Number - The version of this revision
//  - dependencies: [{name: , version: }] 
//    - The dependencies of this revision, an array of
//      objects referring to Revisions by name and version.
//  - template: {name: , version: } - A reference to the script
//                                    which serves as a template
//                                    for this revision.
//  - message: String - The commit message of this revision.
module.exports.findRevision = findRevision;

/******************************************
 * Methods below intended for use only by *
 * import, export, and testing scripts.   *
 ******************************************/

// clearDB(callback(error))
//
// Clear the entire database.
module.exports.clearDB = clearDB;

// disconnect()
//
// Disconnects from MongoDB so the Node process can end.
module.exports.disconnect = function(){
  mongoose.disconnect();
}
