/**
 * This module deals with extracting metadata from revision
 * content text using the ProcessingDB directives:
 *  - @app template templateName
 *  - @module moduleName
 *  - @template templateName
 *  - require('moduleName') or require("moduleName")
 */
var _ = require('underscore');

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
function parse(line, callback){
  //TODO make this more efficient by first checking that the first non ' ' char is a @
  
  // split on whitespace and trim tokens
  var tokens = _.filter(line.split(" "),_.identity);
  
  if(tokens.length > 0){
    var type = tokens[0].substr(1);
    if(type == 'module' || type == 'template'){
      if(tokens.length == 2)
        return { type:type, name:tokens[1] };
      else{
        return { type:'error', message:"'@module' directive found with"+
          " wrong number of arguments.Expected form is '@module moduleName' "+
          "where moduleName is the name of the module."
        };
      }
    }
  }
}

/**
 * callback(err, revision)
 */
exports.parseContent = function(content, callback){
  var lines = content.split('\n');
  var revision = { content:content };

  var i, directive;  
  for(i = 0; i < lines.length; i++){
    directive = parse(lines[i]);
    if(directive){
      if(directive.type == 'module' || directive.type == 'template')
        //TODO report error when type is declared multiple times
        // inject type and name from directive into revision
        revision = _.defaults(revision, directive);
    }
  }
  var requires = content.match(/require\(['|"]([^)]+)['|"]\)/gm);
  revision.dependencies = _.map(requires, function(s){
    return s.replace(/"/g,"'").replace("require('",'').replace("')",'')
  });
  
  callback(null,revision);
};
