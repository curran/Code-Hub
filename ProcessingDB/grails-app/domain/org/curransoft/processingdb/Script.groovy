package org.curransoft.processingdb

class Script {
  static hasMany = [ dependencies : Script ]
  String name
  String code
  String doc
  static constraints = {
    name(blank: false, unique: true)
  }
  String toString(){ return name }
}
