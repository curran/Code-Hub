package org.curransoft.processingdb

class Script {
  static hasMany = [ dependencies : Script ]
  String name
  String code
  String doc
  static constraints = {
    name(blank: false, unique: true)
    code(size:0..2147483646)
    doc(size:0..2147483646)
  }
  String toString(){ return name }
}
