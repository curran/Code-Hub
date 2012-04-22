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
  "  var exports = {}",
  "  var require = function(name) {",
  "    if (exports.hasOwnProperty(name))",
  "      return exports[name];",
  "    return exports[name] = modules[name](require);",
  "  };",
  "  return require;",
  "})();",
  "var modules = {};"
].join('\n');

function indent(text){
  return _.map(text.split('\n'), function(line){
    return "  "+line;
  }).join('\n');
}

function moduleContent(module){
  return [
    "modules['"+module.name+"'] = function(require) {",
    "  var exports = {};",
    indent(module.content),
    "  return exports;",
    "};"
  ].join('\n');
}

function stripDirectives(content){
  //removes ProcessingDB directives starting with @
  return content.replace(/@[^\n]*\n|/g,'');
}

function stripEmptyLines(text){
  return text.replace(/^\s*$[\n\r]{1,}/gm, '');
}

function parseRevisionReference(revisionReference, callback){
  var i = revisionReference.indexOf('.');
  var scriptId = revisionReference.substring(0,i);
  var revNum = revisionReference.substring(i+1);
  callback(scriptId, revNum);
}

// callback(err, templateBegin, templateEnd)
function splitTemplate(template, callback){
  var split = template.split("${code}");
  if(split.length != 2)
    callback(strings.wrongNumberOfCodeStringsInTemplate(split.length - 1));
  else
    callback(null, split[0], split[1]);
}

function splitPropertyValuePair(propertyValuePair, callback){
  var i = propertyValuePair.indexOf('=');
  var property = propertyValuePair.substr(0,i);
  var value = propertyValuePair.substr(i+1);
  callback(property,value);
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
      
      // this contains the code content string of the app
      var app;
      
      // this contains the properties of the app as an array of
      // strings of the form "property=value"
      var appProperties;
      
      // this contains the code content string of the template
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
            appProperties = revision.appProperties;
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
          
          // inject the app properties into the template
          if(appProperties)
            _.forEach(appProperties, function(propertyValuePair){
              splitPropertyValuePair(propertyValuePair, function(property,value){
                template = template.replace('${'+property+'}', value);
              });
            });
          
          splitTemplate(template, function(err, templateBegin, templateEnd){
            if(err)
              callback(err);
            else{
              var compiledApp = [
                templateBegin,
                modules.length != 0 ? library : "",
                _.map(modules, moduleContent).join('\n'),
                app,
                templateEnd
              ].join('\n');
              callback(null, compiledApp);
            }
          });
        }
      });
    }
  });
}
