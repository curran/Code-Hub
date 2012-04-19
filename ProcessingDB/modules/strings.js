/**
 * This module contains all the strings which are
 * included in user-facing content such as error messages.
 */
exports.revNotFound = function(scriptId, revNum){
  return "No revision exists with script id "+scriptId+" and revision number "+revNum+".";
};

exports.cantRunNonApp = function(scriptId, revNum, type){
  return "The revision with script id "+scriptId+" and revision number "+revNum+" is not an app, therefore it cannot be run. This revision is a "+type;
};

exports.wrongNumberOfCodeStringsInTemplate = function(nOccurences){
  return "Templates must have exactly one occurrence of ${code}. There are "+
    nOccurences+" occurences in this template.";
}

exports.wrongNumArgs = function(type){
  if(type == 'app')
    return "'@app' directive found with"+
      " wrong number of arguments. Expected form is '@app template templateName' "+
      "where templateName is the name of the module, or the form '@app property value'"+
      "where 'property' is a property expected by the template, and 'value' is the value passed to the template.";
  else if(type == 'module' || type == 'template')
    return "'@"+type+"' directive found with"+
      " wrong number of arguments. Expected form is '@"+type+" "+type+"Name' "+
      "where "+type+"Name is the name of the "+type+".";
};

exports.appWithNoTemplate = "This app has no template. All apps must have the directive"+
  " '@app template templateName' where 'templateName' is the name of the template the app "+
  "(bundled with its dependencies) should be injected into when run.";

exports.appParameterNotInTemplate = function(templateName,appParameter){
  return "The template '"+templateName+"' does not accept the parameter '"+appParameter+"'";
}

exports.templateParameterNotInApp = function(templateName,parameter){
  return "The template '"+templateName+"' requires the parameter '"+parameter+"'. You must add '@app "+parameter+" value' to your app where 'value' is the value given to the '"+parameter+"' parameter.";
}

exports.scriptAlreadyExistsWithName = function(name){
  return "A script already exists with the name '"+name+"'.";
};

exports.noType = "This script contains no directives which specify it's type. Every script in ProcessingDB must be an 'app', 'template', or 'module'. "+
"To declare this script to be a module, use '@module moduleName' where moduleName is the name by which this module will be available when require('moduleName') is called by other modules or apps. "+
"To declare this script to be a template, use '@template templateName' where templateName is the name of the template. "+
"To declare this script to be an app which can be run (i.e. bundled together with its dependencies and embedded into a template), use '@app template templateName'.";
