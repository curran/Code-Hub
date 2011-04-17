<html>
    <head>
        <title>Welcome to Grails</title>
        <meta name="layout" content="main" />
    </head>
    <body>
        <div>
            <h1>Welcome to ProcessingDB!</h1>

            <g:link controller="script">Scripts</g:link>
            <ul>
            <g:each var="s" in="${org.curransoft.processingdb.Script.list()}">
                <li><g:link action="show" controller="script" id="${s.id}" >${s.name}</g:link>
            </g:each>
            </ul>
        </div>
        <g:link controller="script" action="archive">Download entire database</g:link>
    </body>
</html>
