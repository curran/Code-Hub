

<%@ page import="org.curransoft.processingdb.Revision" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'revision.label', default: 'Revision')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${revisionInstance}">
            <div class="errors">
                <g:renderErrors bean="${revisionInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="name"><g:message code="revision.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" value="${revisionInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="code"><g:message code="revision.code.label" default="Code" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'code', 'errors')}">
                                    <g:textArea name="code" cols="40" rows="5" value="${revisionInstance?.code}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="description"><g:message code="revision.description.label" default="Description" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'description', 'errors')}">
                                    <g:textArea name="description" cols="40" rows="5" value="${revisionInstance?.description}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="doc"><g:message code="revision.doc.label" default="Doc" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'doc', 'errors')}">
                                    <g:textArea name="doc" cols="40" rows="5" value="${revisionInstance?.doc}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="creator"><g:message code="revision.creator.label" default="Creator" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'creator', 'errors')}">
                                    <g:select name="creator.id" from="${org.curransoft.processingdb.User.list()}" optionKey="id" value="${revisionInstance?.creator?.id}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="isApp"><g:message code="revision.isApp.label" default="Is App" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'isApp', 'errors')}">
                                    <g:checkBox name="isApp" value="${revisionInstance?.isApp}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="script"><g:message code="revision.script.label" default="Script" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: revisionInstance, field: 'script', 'errors')}">
                                    <g:select name="script.id" from="${org.curransoft.processingdb.Script.list()}" optionKey="id" value="${revisionInstance?.script?.id}"  />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
