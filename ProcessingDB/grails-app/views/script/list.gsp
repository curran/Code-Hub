
<%@ page import="org.curransoft.processingdb.Script" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'script.label', default: 'Script')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="list">
                <table>
                    <thead>
                        <tr>
                        
                            <g:sortableColumn property="id" title="${message(code: 'script.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'script.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="code" title="${message(code: 'script.code.label', default: 'Code')}" />
                        
                            <g:sortableColumn property="doc" title="${message(code: 'script.doc.label', default: 'Doc')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${scriptInstanceList}" status="i" var="scriptInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${scriptInstance.id}">${fieldValue(bean: scriptInstance, field: "id")}</g:link></td>
                        
                            <td>${fieldValue(bean: scriptInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: scriptInstance, field: "code")}</td>
                        
                            <td>${fieldValue(bean: scriptInstance, field: "doc")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${scriptInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
