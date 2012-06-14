/**
 * This module deals with extracting metadata from revision
 * content text using the ProcessingDB directives:
 *  - @app propertyName propertyValue
 *  - @module moduleName
 *  - @template templateName
 *  - require('moduleName') or require("moduleName")
 */
var _ = require('underscore');
var strings = require('./strings');

/**
 * Parses ProcessingDB directives starting with @ from a line.
 * Returns null if no directive was found.
 * Returns an object if a directive was found
 * where the 'type' property is
 * 'app', 'module', 'template', or 'require'.
 * If (type=='app'), the properties 'property' and 'value'
 *   are available, where 'property' gets the first token after
 *   @app, and 'value' gets the rest of the line after 'property'.
 * If (type=='module') or (type=='template'), the 'name' property is available.
 * If an error occurs, type=='error' and the 'message' property is available.
 */
function parseDirective(line){
  // split on whitespace and trim tokens
  var tokens = _.filter(line.split(" "),_.identity);
  if(tokens.length > 0){
    var type = tokens[0].substr(1);
    if(type == 'module' || type == 'template')
      if(tokens.length == 2)
        return { type:type, name:tokens[1] };
      else
        return { type:'error', message: strings.wrongNumArgs(type)};
    else if(type == 'app'){
      if(tokens.length > 2)
        return {
          type:type,
          property:tokens[1],
          value:line.substr(line.indexOf(tokens[1])+tokens[1].length+1)
          //value:tokens.splice(2).join(' ')
        };
      else
        return { type:'error', message:strings.wrongNumArgs(type) };
    }
    else
      return { type:'error', message:strings.invalidDirective(type) };
  }
}

/**
 * Trims the 'require(' and ')...' parts from a require string,
 * returning only the name of the required module.
 */
function parseRequire(requireString){
  return requireString.replace(/"/g,"'").replace(/require\('|'\)/g,'');
}

/**
 * Trims the '${' and '}' parts from a template parameter string.
 */
function parseTemplateParameter(templateParameterString){
  return templateParameterString.replace(/\${|}/g,'');
}

function removeComments(content){
  // remove // comments
  content = content.replace(/\/\/[^\n]*/g, '');
  // remove /* comments */
  return content.replace(/\/\*([^\*]|(\*[^\/])|\n)*\*\//g,'');
}

/**
 * callback(err, revision)
 * This function injects:
 *   revision.type
 *   revision.name
 *   revision.dependencies
 *   revision.templateName
 *   revision.appProperties
 *   revision.content
 *   revision.templateParameters
 */
exports.parseContent = function(content, callback){
  if(content == null || content == undefined)
    callback("Content given to preprocessor is null.");
  else{
    
    // This is the object which will be populated and passed to the callback.
    var revision = {};
    
    revision.content = content;
    
    // Remove comments before parsing so nothing in a comment is parsed as a directuve
    content = removeComments(content);
    
    
    // Match all at once the following types of directives:
    //  - require('moduleName')
    //  - @directive args ...
    //  - ${appParameter}
    var matches = content.match(/(require\(['|"][^)]+['|"]\))|@.*|\${[^}]*}/gm);
    
    var isDirective = function(s){ return s.indexOf("@") != -1; };
    var directives = _.map(_.filter(matches, isDirective), parseDirective);
    
    var isRequire = function(s){ return s.indexOf("require(") != -1; };
    revision.dependencies = _.uniq(_.map(_.filter(matches, isRequire), parseRequire));
    
    var isTemplateParameter = function(s){ 
      return s.indexOf("${") != -1 && s != strings.scriptsPlaceholder;
    };
    
    revision.templateParameters = _.map(_.filter(matches, isTemplateParameter), parseTemplateParameter);
    
    var err;
    _.each(directives,function(directive){
      if(directive.type == 'error')
        err = directive.message;
      else if(revision.type && (revision.type != directive.type))
        err = strings.multipleTypes(revision.type, directive.type);
      else if(directive.type == 'module' || directive.type == 'template')
        revision = _.defaults(revision,directive); // 'type' and 'name' from directive
      else if(directive.type == 'app'){
        revision.type = 'app';
        if(directive.property == 'template')
          revision.templateName = directive.value;
        else if(directive.property.indexOf('=') != -1)
          //TODO test this path
          err = "Equal sign not allowed in app property names.";
        else{
          if(!revision.appProperties)
            revision.appProperties = [];
          revision.appProperties.push(directive.property+'='+directive.value);
        }
      }
    });
    
    callback(err,revision);
  }
};

exports.removeComments = removeComments;