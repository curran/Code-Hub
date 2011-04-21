

<%@ page import="org.curransoft.processingdb.Script" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'script.label', default: 'Script')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>
        <script src="${resource(dir:'js/edit_area/',file:'edit_area_full.js')}"></script>
        <script src="${resource(dir:'js/ckeditor/',file:'ckeditor.js')}"></script>

        <script language="Javascript" type="text/javascript"> 
		    // initialization of the code editor using the edit_area library
		    editAreaLoader.init({
			    id: "code"	// id of the textarea to transform		
			    ,start_highlight: true	// if start with highlight
			    ,allow_resize: "both"
			    ,allow_toggle: true
			    ,word_wrap: true
			    ,language: "en"
			    ,syntax: "java"
                ,min_width: "600"
                ,min_height: "600"
		    });

            // initialization of the HTML editor for documentation
            window.onload = function(){CKEDITOR.replace( 'doc',
            {
		        toolbar : [ 
                ['Maximize','Source','Scayt','Undo','Redo','-','Find','Replace'],
                ['Image','Table','HorizontalRule','SpecialChar','Iframe','-','Subscript','Superscript'],
                ['Link','Unlink','Anchor'],
                '/',
                ['Bold','Italic','Underline','Strike'],
                ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
                ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
                ['Font','FontSize'],
                ['TextColor','BGColor']
                ]
	        } );}

        </script> 
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.edit.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${scriptInstance}">
            <div class="errors">
                <g:renderErrors bean="${scriptInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form method="post" >
                <g:hiddenField name="id" value="${scriptInstance?.id}" />
                <g:hiddenField name="version" value="${scriptInstance?.version}" />
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="name"><g:message code="script.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: scriptInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" value="${scriptInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="code"><g:message code="script.code.label" default="Code" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: scriptInstance, field: 'code', 'errors')}">
                                    <g:textArea name="code" value="${scriptInstance?.code}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="dependencies"><g:message code="script.dependencies.label" default="Dependencies" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: scriptInstance, field: 'dependencies', 'errors')}">
                                    <g:select name="dependencies" from="${org.curransoft.processingdb.Script.list()}" multiple="yes" optionKey="id" size="5" value="${scriptInstance?.dependencies*.id}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="doc"><g:message code="script.doc.label" default="Doc" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: scriptInstance, field: 'doc', 'errors')}">
                                    <g:textArea name="doc" value="${scriptInstance?.doc}" />
                                </td>
                            </tr>
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="isApp"><g:message code="script.isApp.label" default="Is App" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: scriptInstance, field: 'isApp', 'errors')}">
                                    <g:checkBox name="isApp" value="${scriptInstance?.isApp}" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:actionSubmit class="save" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
