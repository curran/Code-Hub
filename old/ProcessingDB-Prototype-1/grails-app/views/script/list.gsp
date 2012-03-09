
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
            <g:if test="${session?.user}">
                <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
            </g:if>
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
                            <g:sortableColumn property="name" title="${message(code: 'script.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="description" title="${message(code: 'script.description.label', default: 'Description')}" />
                        
                            <th><g:message code="script.creator.label" default="Creator" /></th>
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${scriptInstanceList}" status="i" var="scriptInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td>
                                <g:link action="show" id="${scriptInstance.id}">
                                    ${scriptInstance.current.name}
                                </g:link>
                                [<g:link controller="revision" action="edit" id="${scriptInstance.current.id}">
                                    edit
                                </g:link>]
                            </td>
                        
                            <td>${scriptInstance.current.description}</td>
                        
                            <td>
                                <g:link controller="user" action="show" id="${scriptInstance.current.creator.id}">
                                    ${scriptInstance.current.creator}
                                </g:link>
                            </td>
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
