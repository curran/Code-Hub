
<%@ page import="org.curransoft.processingdb.Revision" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'revision.label', default: 'Revision')}" />
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
                        
                            <g:sortableColumn property="id" title="${message(code: 'revision.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'revision.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="code" title="${message(code: 'revision.code.label', default: 'Code')}" />
                        
                            <g:sortableColumn property="description" title="${message(code: 'revision.description.label', default: 'Description')}" />
                        
                            <g:sortableColumn property="doc" title="${message(code: 'revision.doc.label', default: 'Doc')}" />
                        
                            <th><g:message code="revision.creator.label" default="Creator" /></th>
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${revisionInstanceList}" status="i" var="revisionInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${revisionInstance.id}">${fieldValue(bean: revisionInstance, field: "id")}</g:link></td>
                        
                            <td>${fieldValue(bean: revisionInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: revisionInstance, field: "code")}</td>
                        
                            <td>${fieldValue(bean: revisionInstance, field: "description")}</td>
                        
                            <td>${fieldValue(bean: revisionInstance, field: "doc")}</td>
                        
                            <td>${fieldValue(bean: revisionInstance, field: "creator")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${revisionInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
