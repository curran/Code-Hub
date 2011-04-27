package org.curransoft.processingdb

class Script {
  static hasMany = [ revisions : Revision ]
  Revision first
  Revision current
  static constraints = {
    first(nullable:true)
    current(nullable:true)
  }
}
