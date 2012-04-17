var fs = require('fs');
var backend;
var async = require('async');

var prefix = './';

/**
 * Reads the file './testData/'+scriptName+'.txt'.
 * callback(err, content);
 */
function read(scriptName, callback){
  fs.readFile(prefix+'testData/'+scriptName+'.txt', 'ascii', callback);
}
exports.read = read;

/**
 * Loads a file from the testData directory.
 * callback(err, scriptId, revNum);
 */
function load(scriptName,callback){
  if(!backend)
    backend = require('../modules/backend');
  read(scriptName,function(err,content){
    backend.createScript(function(err, scriptId){
      backend.createRevision(scriptId, content, function(err, revNum){
        callback(err, scriptId, revNum);
      });
    });
  });
}
exports.load = load;

exports.loadExampleModel = function(){
  prefix = './tests/';
  var scriptNames = ['math','increment','minimalHTML','incrementTest'];
  async.forEachSeries(scriptNames,load);
}
