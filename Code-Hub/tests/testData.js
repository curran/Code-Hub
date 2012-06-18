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
    if(err) 
      callback(err);
    else
      backend.createScript(function(err, scriptId){
        if(err) 
          callback(err);
        else
          backend.createRevision(scriptId, content, null, function(err, revNum){
            if(err) 
              callback(err);
            else
              callback(err, scriptId, revNum);
          });
      });
  });
}
exports.load = load;

exports.loadExampleModel = function(){
  prefix = './tests/';
  var scriptNames = ['math','increment','minimalHTML','incrementTestApp',
                     'jQuery','jQueryTestApp'];
  async.forEachSeries(scriptNames,load);
}
