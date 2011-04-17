package org.curransoft.processingdb

class Script {
  static hasMany = [ dependencies : Script ]
  String name
  String description = ""
  String code
  String doc
  boolean isApp = false//true when app, false when library
  static constraints = {
    name(blank: false, unique: true)
    code(size:0..2147483646)
    doc(size:0..2147483646)
  }
  String toString(){ return name }
}
