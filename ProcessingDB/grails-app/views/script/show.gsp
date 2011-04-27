
<%@ page import="org.curransoft.processingdb.Script" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'script.label', default: 'Script')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <g:if test="${session?.user}">
                <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
            </g:if>
        </div>
        <div class="body">
            <h1>${scriptInstance.current.name}</h1>
            <h2>${scriptInstance.current.description}</h2> <br>
            Created by <g:link controller="user" action="show" id="${scriptInstance?.current.creator?.id}">${scriptInstance?.current.creator?.encodeAsHTML()}</g:link>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
                <table>
                    <tbody>
                        
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="script.doc.label" default="Doc" /></td>
                            
                            <td valign="top" class="value">${scriptInstance.current.doc}</td>
                            
                        </tr>
                    
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="script.dependencies.label" default="Dependencies" /></td>
                            
                            <td valign="top" style="text-align: left;" class="value">
                                <ul>
                                <g:each in="${scriptInstance.current.dependencies}" var="d">
                                    <li><g:link controller="script" action="show" id="${d.id}">${d?.encodeAsHTML()}</g:link></li>
                                </g:each>
                                </ul>
                            </td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="script.isApp.label" default="Is App" /></td>
                            
                            <td valign="top" class="value"><g:formatBoolean boolean="${scriptInstance?.current.isApp}" /></td>
                            
                        </tr>
                    
                    </tbody>
                </table>
            </div>
            <div class="buttons">
                <g:form controller= "revision">
                    <g:hiddenField name="id" value="${scriptInstance?.current.id}" />
                    <span class="button"><g:actionSubmit class="edit"  action="edit" value="${message(code: 'default.button.edit.label', default: 'Edit')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </g:form>
            </div>
        </div>
    </body>
</html>
