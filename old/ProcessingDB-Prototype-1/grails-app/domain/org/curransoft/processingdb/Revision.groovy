package org.curransoft.processingdb

class Revision {
  static hasMany = [ dependencies : Revision ]
  static belongsTo = [creator:User, script:Script]
  int revNum
  String name
  String description
  String code
  String test
  String doc
  boolean isApp = false//true when app, false when library
  static constraints = {
    name(blank: false)
    code(size:0..2147483646, nullable:true)
    test(size:0..2147483646, nullable:true)
    description(size:0..1000, nullable:true)
    doc(size:0..2147483646, nullable:true)
  }
  String toString(){ return name +"(rev "+revNum+")" }
}
