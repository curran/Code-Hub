package org.curransoft.processingdb

class User {
    static hasMany = [ scripts : Script, revisions : Revision ]

    String login
    String password
    static constraints = {
        login(blank:false, unique:true)
        password(blank:false)
    }
    public String toString (){
        return login
    }
}
