<html>
    <head>
        <title>ProcessingDB</title>
        <meta name="layout" content="main" />
        <style type="text/css" media="screen">

        #nav {
            margin-top:20px;
            margin-left:30px;
            width:228px;
            float:left;
        }
        .homePagePanel * {
            margin:0px;
        }
        .homePagePanel .panelBody ul {
            list-style-type:none;
            margin-bottom:10px;
        }
        .homePagePanel .panelBody h1 {
            text-transform:uppercase;
            font-size:1.1em;
            margin-bottom:10px;
        }
        .homePagePanel .panelBody {
            background: url(images/leftnav_midstretch.png) repeat-y top;
            margin:0px;
            padding:15px;
        }
        .homePagePanel .panelBtm {
            background: url(images/leftnav_btm.png) no-repeat top;
            height:20px;
            margin:0px;
        }

        .homePagePanel .panelTop {
            background: url(images/leftnav_top.png) no-repeat top;
            height:11px;
            margin:0px;
        }
        h2 {
            margin-top:15px;
            margin-bottom:15px;
            font-size:1.2em;
        }
        #pageBody {
            margin-left:280px;
            margin-right:20px;
        }
        </style>
    </head>
    <body>
        <div id="nav">
            <div class="homePagePanel">
                <div class="panelTop"></div>
                <div class="panelBody">
                    <h1><g:link controller="script">Scripts</g:link></h1>
                    <ul>
                    <g:each var="s" in="${org.curransoft.processingdb.Script.list()}">
                        <li><g:link action="show" controller="script" id="${s.id}" >${s.current.name}</g:link>
                    </g:each>
                    </ul>
                    <h1><g:link controller="user">Users</g:link></h1>
                    <ul>
                    <g:each var="u" in="${org.curransoft.processingdb.User.list()}">
                        <li><g:link action="show" controller="user" id="${u.id}" >${u.login}</g:link>
                    </g:each>
                    </ul>
                </div>
                <div class="panelBtm"></div>
            </div>
        </div>
        <div id="pageBody">
            <h1>Welcome to ProcessingDB!</h1>
            A pre-alpha stage project aimed to become a global wiki for <a href="http://processing.org/">Processing</a> code, enabling mass-collaborative development of web-embeddable graphics and information visualization programs.
            <br><br>
            <a href="http://curransoft.com/code/2011/04/processingdb/"> Click here </a> to learn more about this site.
<br><br>
            
            
            <g:link controller="script" action="archive">Download entire database</g:link>
        </div>
    </body>
</html>
