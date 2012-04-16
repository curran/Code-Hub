/**
 * This module is responsible for compiling apps together with their dependencies
 * and embedding the 
 */
var backend = require('./backend');
var strings = require('./strings');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');

// method of compilation inspired by http://wiki.commonjs.org/wiki/Modules/CompiledModules
var library = [
  "var require = (function() {",
  "  var exportsObjects = {}",
  "  var require = function(name) {",
  "    if (exportsObjects.hasOwnProperty(name))",
  "      return exportsObjects[name];",
  "    var exports = {};",
  "    exportsObjects[name] = exports;",
  "    modules[name](require, exports);",
  "    return exports;",
  "  };",
  "  return require;",
  "})();"
].join('\n');

function beforeModuleContent(moduleName){
  return "modules['"+moduleName+"'] = function(require, exports) {";
}

var afterModuleContent = "};";

function stripDirectives(content){
  //removes ProcessingDB directives starting with @
  return content.replace(/@[^\n]*\n/g,'');
}

function parseRevisionReference(revisionReference, callback){
  var i = revisionReference.indexOf('.');
  var scriptId = revisionReference.substring(0,i);
  var revNum = revisionReference.substring(i+1);
  callback(scriptId, revNum);
}

/**
 * callback(err, compiledApp)
 * compiledApp is the string of the app and module code
 * bundled together and embedded into the template.
 */
exports.compileApp = function(scriptId, revNum, callback){
  backend.getRevision(scriptId, revNum, function(err, revision){
    if(err)
      callback(err);
    else if(revision.type != 'app')
      callback(strings.cantRunNonApp(scriptId, revNum, type));
    else{
      // this contains the code content of each module
      // each entry is an object with 'name' and 'content'.
      // The content has the @ directives stripped out.
      var modules = [];
      
      // this contains the code content of the app
      var app;
      
      // this contains the code content of the template
      var template;
      
      // populate 'modules', 'app', and 'template'
      async.parallel([
        // populate 'modules'
        function(callback){
          async.forEach(revision.appDependencies, function(moduleRef, callback){
            parseRevisionReference(moduleRef,function(scriptId, revNum){
              backend.getRevision(scriptId, revNum, function(err, revision){
                modules.push({
                  name: revision.name,
                  content: stripDirectives(revision.content)
                });
                callback();
              });
            });
          },callback);
          // callback();
        },
        // populate 'app'
        function(callback){
          backend.getRevision(scriptId, revNum, function(err, revision){
            app = stripDirectives(revision.content);
            callback();
          });
        },
        // populate 'template'
        function(callback){
          parseRevisionReference(revision.template,function(scriptId, revNum){
            backend.getRevision(scriptId, revNum, function(err, revision){
              template = stripDirectives(revision.content);
              callback();
            });
          });
        }
      ],function(err){
        if(err)
          callback(err);
        else{
          // at this point 'modules', 'app', and 'template' have been populated
          
          var splitTemplate = template.split("${code}");
          if(splitTemplate.length != 2)
            callback("Templates must have exactly one occurrence of ${code}");
          else{
            var templateBeginning = splitTemplate[0];
            var templateEnd = splitTemplate[1];
            
            var compiledApp = [
              templateBeginning,
              library,
              _.map(modules, function(module){
                return [
                  beforeModuleContent(module.name),
                  module.content,
                  afterModuleContent
                ].join('\n');
              }).join('\n'),
              templateEnd
            ].join('\n');
            
            //console.log("modules[1] = "+modules[1].content);
            
            //console.log("app = "+app);
            
            console.log("compiledApp = "+compiledApp);
            
            callback(null, "CompiledApp");
          }
        }
      });
    }
  });
}
