package org.curransoft.processingdb

class Script {
  static hasMany = [ dependencies : Script ]
  static belongsTo = [creator:User]
  String name
  String description
  String code
  String doc
  boolean isApp = false//true when app, false when library
  static constraints = {
    name(blank: false, unique: true)
    code(size:0..2147483646)
    description(size:0..1000, nullable:true)
    doc(size:0..2147483646, nullable:true)
  }
  String toString(){ return name }
}
