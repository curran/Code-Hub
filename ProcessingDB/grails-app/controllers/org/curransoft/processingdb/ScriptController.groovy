package org.curransoft.processingdb
import grails.converters.*
class ScriptController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

     def run = {
        def scriptInstance = Script.get(params.id)
        if (!scriptInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
            redirect(action: "list")
        }
        else {
            [scriptInstance: scriptInstance]
        }
    }

    def get = {
        def scriptInstance = Script.get(params.id)
        if (!scriptInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
            redirect(action: "list")
        }
        else
            render getFullCode(scriptInstance,[]);
    }

    String getFullCode(Script s,includedScripts){
        String fullCode = "";
        s.dependencies.each{
          if(!includedScripts.contains(it.id)){
            includedScripts.add(it.id)
            fullCode+=getFullCode(it,includedScripts)+"\n"
          }
        };
        fullCode += s.code;
        return fullCode;
    }

    def archive = {
        render Script.list() as XML
    }

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [scriptInstanceList: Script.list(params), scriptInstanceTotal: Script.count()]
    }

    def create = {
        if(session.user){
            def scriptInstance = new Script()
            scriptInstance.properties = params
            return [scriptInstance: scriptInstance]
        }
        else
            render "Please log in to create new scripts."//TODO redirect to login screen and remember intent to create a script
    }

    def save = {

        if(session.user){
            def scriptInstance = new Script(params)

            def user = User.get(session.user.id)
            scriptInstance.creator = user
                
            
           // scriptInstance.creator = user
            //scriptInstance.save()
            //render "scriptInstance.creator = "+scriptInstance.creator

//            if (scriptInstance.save(flush: true)) {
            if (user.addToScripts(scriptInstance).save(flush: true)) {
                flash.message = "${message(code: 'default.created.message', args: [message(code: 'script.label', default: 'Script'), scriptInstance.id])}"
                redirect(action: "show", id: scriptInstance.id)
            }
            else {
                render(view: "create", model: [scriptInstance: scriptInstance])
            }
        }
        else
            render "Please log in to create new scripts."//TODO redirect to login screen and remember intent to create a script
    }

    def show = {
        def scriptInstance = Script.get(params.id)
        if (!scriptInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
            redirect(action: "list")
        }
        else {
            [scriptInstance: scriptInstance]
        }
    }

    def edit = {
        def scriptInstance = Script.get(params.id)
        if (!scriptInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [scriptInstance: scriptInstance]
        }
    }

    def update = {
        def scriptInstance = Script.get(params.id)
        if (scriptInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (scriptInstance.version > version) {
                    
                    scriptInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'script.label', default: 'Script')] as Object[], "Another user has updated this Script while you were editing")
                    render(view: "edit", model: [scriptInstance: scriptInstance])
                    return
                }
            }
            scriptInstance.properties = params
            if (!scriptInstance.hasErrors() && scriptInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'script.label', default: 'Script'), scriptInstance.id])}"
                redirect(action: "show", id: scriptInstance.id)
            }
            else {
                render(view: "edit", model: [scriptInstance: scriptInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def scriptInstance = Script.get(params.id)
        if (scriptInstance) {
            try {
                scriptInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'script.label', default: 'Script'), params.id])}"
            redirect(action: "list")
        }
    }
}
