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