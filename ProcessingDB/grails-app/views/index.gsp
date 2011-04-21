<html>
    <head>
        <title>ProcessingDB</title>
        <meta name="layout" content="main" />
    </head>
    <body>
        <div>
            <h1>Welcome to ProcessingDB!</h1>
            A pre-alpha stage project aimed to become a global wiki for <a href="http://processing.org/">Processing</a> code, enabling mass-collaborative development of web-embeddable graphics and information visualization programs.
            <br><br>
            <a href="http://curransoft.com/code/2011/04/processingdb/"> Click here </a> to learn more about this site.
<br><br>
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
