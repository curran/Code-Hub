package org.curransoft.processingdb

class RevisionController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def run = {
        def revisionInstance = Revision.get(params.id)
        if (!revisionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
            redirect(action: "list")
        }
        else {
            [revisionInstance: revisionInstance]
        }
    }

    def get = {
        def revisionInstance = Revision.get(params.id)
        if (!revisionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
            redirect(action: "list")
        }
        else
            render getFullCode(revisionInstance,[]);
    }

    String getFullCode(Revision r,includedRevisions){
        String fullCode = "";
        r.dependencies.each{
          if(!includedRevisions.contains(it.id)){
            includedRevisions.add(it.id)
            fullCode+=getFullCode(it,includedRevisions)+"\n"
          }
        };
        fullCode += r.code;
        return fullCode;
    }

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [revisionInstanceList: Revision.list(params), revisionInstanceTotal: Revision.count()]
    }

    def create = {
        def revisionInstance = new Revision()
        revisionInstance.properties = params
        return [revisionInstance: revisionInstance]
    }

    def save = {
        def revisionInstance = new Revision(params)
        if (revisionInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'revision.label', default: 'Revision'), revisionInstance.id])}"
            redirect(action: "show", id: revisionInstance.id)
        }
        else {
            render(view: "create", model: [revisionInstance: revisionInstance])
        }
    }

    def show = {
        def revisionInstance = Revision.get(params.id)
        if (!revisionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
            redirect(action: "list")
        }
        else {
            [revisionInstance: revisionInstance]
        }
    }

    def edit = {
        def revisionInstance = Revision.get(params.id)
        if (!revisionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [revisionInstance: revisionInstance]
        }
    }

    def update = {
        def revisionInstance = Revision.get(params.id)
        if (revisionInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (revisionInstance.version > version) {
                    revisionInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'revision.label', default: 'Revision')] as Object[], "Another user has updated this Revision while you were editing")
                    render(view: "edit", model: [revisionInstance: revisionInstance])
                    return
                }
            }
            def nextRevisionInstance = new Revision()
            nextRevisionInstance.properties = params
            revisionInstance.creator.addToRevisions(nextRevisionInstance).save()
            def script = revisionInstance.script
            script.addToRevisions(nextRevisionInstance).save()
            nextRevisionInstance.revNum = revisionInstance.revNum + 1

            if (!nextRevisionInstance.hasErrors() && nextRevisionInstance.save(flush: true)) {
                script.current = nextRevisionInstance
                script.save(flush:true)
                redirect(action: "edit", id: nextRevisionInstance.id)
            }
            else {
                render(view: "edit", model: [revisionInstance: revisionInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def revisionInstance = Revision.get(params.id)
        if (revisionInstance) {
            try {
                revisionInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'revision.label', default: 'Revision'), params.id])}"
            redirect(action: "list")
        }
    }
}
