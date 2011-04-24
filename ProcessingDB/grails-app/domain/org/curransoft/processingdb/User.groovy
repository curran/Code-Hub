package org.curransoft.processingdb

class User {
    static hasMany = [ scripts : Script ]
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
