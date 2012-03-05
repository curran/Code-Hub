// The parser for the ProcessingDB DSL (Domain Specific Language),
// which supports the following constructs:
//
// - "@depends on Foo 0.5"
//   Means this script depends on script "Foo" version 0.5
// - "@embed in Bar 1.4"
//   Means this script, when concatenated with its dependencies,
//   should be embedded into the template in script "Bar" version 1.4.
// - "${code}"
//   Occurs only in templates. This string will be replaced by the
//   full content of scripts embedded into this template.


// Parses the dependencies out of the given script content.
// callbacks.dependsOn(name, version) is called for each '@depends' occurance.
// callbacks.embedIn(name, version) is called for each '@embed in' occurance.
// callbacks.error(err) is called if there is an error.
var parseContent = function(content, callbacks){
  var lines = content.split('\n');
  for(var i = 0; i < lines.length; i++){
    var line = lines[i].trim();
    
    //TODO handle errors when:
    // - @embed target doesn't contain exactly one '${code}'
    var dependsOn = line.indexOf('@depends') != -1;
    var embedIn = line.indexOf('@embed') != -1;
    
    if(dependsOn || embedIn){
      // Parse tokens, ignoring extra white space
      var rawTokens = line.split(' '), tokens = [];
      for(var j=0;j<rawTokens.length;j++)
        if(rawTokens[j] != '' && rawTokens[j] != '\n')
          tokens.push(rawTokens[j]);
          
      if(tokens.length != 4
         || (dependsOn && (tokens[0] != '@depends' || tokens[1] != 'on'))
         || (embedIn   && (tokens[0] != '@embed'   || tokens[1] != 'in'))){
        if(dependsOn)
          callbacks.error("Oops! Script not saved - invalid syntax in \""+line
            +"\". If a script depends on version 0.05 of script A, "
            +"the syntax should be: \"@depends on A 0.05\"");
        else if(embedIn)
          callbacks.error("Oops! Script not saved - invalid syntax in \""+line
            +"\". If a script is embedded into version 0.05 of script A, "
            +"the syntax should be: \"@embed in A 0.05\"");
      }
      else{
        var name = tokens[2];
        var version = tokens[3];
        if(dependsOn)
          callbacks.dependsOn(name, version);
        else if(embedIn)
          callbacks.embedIn(name, version);
      }
    }
  }
}

// addDependenciesAndTemplate(revision, callback(err))
//
// Parses revision.content and adds revision.dependencies
// and revision.template based on occurrences of "@depends"
// and "@embed in".
module.exports.addDependenciesAndTemplate = function (revision, callback){
  var error = null;
  revision.dependencies = [];
  parseContent(revision.content, {
    dependsOn: function(name, version){
      revision.dependencies.push({
        name: name, version: version
      });
    },
    embedIn: function(name, version){
      // TODO report error when multiple '@embed in's are found
      revision.template = {
        name: name, version: version
      };
    },
    error: function(err){
      error = err;
    }
    //TODO parse occurances of '${code}'
    //TODO report error when '${code}' is present with 
    //     either '@depends on' or '@embed in'
  });
  if(error)
    callback(error);
  else
    callback(null);
};
