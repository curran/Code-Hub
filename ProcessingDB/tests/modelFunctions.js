var async = require('async');

/**
 * This file is not a unit test, but is a set of test functions which 
 * can be run on several modules, e.g. mongodb and backend, or git and backend.
 * This module was created so these functions need only be written once.
 */

var createTestRevision = function(){
  return {
    commitMessage: "Test Commit Message",
    commitDate: new Date(2012, 4, 9),
    parentRevision: "",
    type: 'template',
    name: 'TestTemplate',
    content: 'Test Content',
    dependencies: '',
    template: '4.3',
    templateName: 'TestTemplate'
  };
}

exports.createTestRevision = createTestRevision;

exports.testCreateScript = function(module,test){
  async.waterfall([
    module.createScript,
    function(scriptId, callback){
      test.equal(scriptId, 1 , "First Script id should be 1");
      module.createScript(callback);
    },
    function(scriptId, callback){
      test.equal(scriptId, 2 , "Second Script id should be 2");
      module.createScript(callback);
    },
    function(scriptId, callback){
      test.equal(scriptId, 3 , "Third Script id should be 3");
      module.clear(callback);
    },
    function(callback){
      test.done();
    }
  ]);
}

exports.testRevisionWriteRead = function(module, test){
  var revision = createTestRevision();
  var scriptId;
  async.waterfall([
    module.createScript,
    function(newScriptId, callback){
      scriptId = newScriptId;
      test.equal(scriptId, 1 , "First Script id should be 1");
      module.createRevision(scriptId, revision, callback);
    },
    function(revNum, callback){
      test.equal(revNum, 1 , "First revNum should be 1");
      module.createRevision(scriptId, null, function(err, revNum){
        test.equal(err, "Revision object is null." , "Null revision should cause error.");
        module.createRevision(scriptId, revision, callback);
      });
    },
    function(revNum, callback){
      test.equal(revNum, 2 , "Second revNum should be 2");
      module.getRevision(scriptId, revNum, function(err, revisionFromStore){
        test.equal(revision.commitMessage , revisionFromStore.commitMessage , "commitMessage  should match");
        test.equal(revision.commitDate.toString() , revisionFromStore.commitDate.toString() , "commitDate  should match");
        test.equal(revision.parentRevision , revisionFromStore.parentRevision , "parentRevision  should match");
        test.equal(revision.type , revisionFromStore.type , "type  should match");
        test.equal(revision.name , revisionFromStore.name , "name  should match");
        test.equal(revision.dependencies , revisionFromStore.dependencies , "dependencies  should match");
        test.equal(revision.template , revisionFromStore.template , "template  should match");
        test.equal(revision.templateName , revisionFromStore.templateName , "template  should match");
        test.done();
      });
    }
  ]);
};
