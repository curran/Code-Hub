/**
 * This module deals with extracting metadata from revision
 * content text using the ProcessingDB directives:
 *  - @app propertyName propertyValue
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
function parse(line){
  // split on whitespace and trim tokens
  var tokens = _.filter(line.split(" "),_.identity);
  if(tokens.length > 0){
    var type = tokens[0].substr(1);
    if(type == 'module' || type == 'template'){
      if(tokens.length == 2){
        return { type:type, name:tokens[1] };
      }
      else{
        //TODO write unit test for this error
        return { type:'error', message:"'@module' directive found with"+
          " wrong number of arguments. Expected form is '@module moduleName' "+
          "where moduleName is the name of the module."
        };
      }
    }
    else if(type == 'app'){
      if(tokens.length > 2)
        return {
          type:type,
          property:tokens[1],
          value:line.substr(line.indexOf(tokens[1])+tokens[1].length+1)
          //value:tokens.splice(2).join(' ')
        };
      else{
        //TODO write unit test for this error
        return { type:'error', message:"'@app' directive found with"+
          " wrong number of arguments. Expected form is '@app moduleName' "+
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
  //TODO test errors when content contains no directives
  
  var matches = content.match(/(require\(['|"][^)]+['|"]\))|@.*/gm);
  
  var hasAtSymbol = function(s){ return s.indexOf("@") != -1 };
  var directives = _.map(_.filter(matches, hasAtSymbol), parse);
  var requires = _.reject(matches, hasAtSymbol);
  
  var revision = {};
  //TODO report error when type is declared multiple times
  _.each(directives,function(directive){
    if(directive.type == 'module' || directive.type == 'template')
      revision = _.defaults(revision,directive); // 'type' and 'name' from directive
    else if(directive.type == 'app'){
      revision.type = 'app';
      if(directive.property == 'template')
        revision.templateName = directive.value;
      else{
        if(!revision.properties)
          revision.properties = {};
        revision.properties[directive.property] = directive.value;
      }
    }
  });
  
  //TODO test errors when content contains no type declarations
  revision.content = content;

  revision.dependencies = _.map(requires, function(s){
    return s.replace(/"/g,"'").replace(/require\('|'\)/g,'')
  });
  
  callback(null,revision);
};
