<!DOCTYPE html>
<html>
    <head>
        <title><g:layoutTitle default="Grails" /></title>
        <link rel="stylesheet" href="${resource(dir:'css',file:'main.css')}" />
        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />
        <g:layoutHead />
        <g:javascript library="application" />
    </head>
    <body>
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        <div id="grailsLogo"><a href="${createLink(uri: '/')}"><img src="${resource(dir:'images',file:'grails_logo.png')}" alt="Grails" border="0" /></a></div>
        <g:if test="${onRegistrationPage}">
        </g:if>
        <g:else>
            <div id="loginBox" class="loginBox">
                <g:if test="${session?.user}">
                    <div style="margin-top:20px" align="RIGHT">
                        <div style="float:right;">
                            Welcome <span id="userName">${session.user.login}!</span><br>
                            <g:link controller="user" action="logout">Logout</g:link>
                        </div>
                    </div>
                </g:if>
                <g:else>
                    <g:form name="loginForm" url="[controller:'user',action:'login']">
                        <div>Username:</div>
                        <g:textField name="login"></g:textField>
                        <div>Password:</div>
                        <g:textField name="password"/>
                        <input type="submit" value="Login" />
                    </g:form>
                    <g:renderErrors bean="${loginCmd}"></g:renderErrors>
                    or <g:link controller="user" action="register">register</g:link>
                </g:else>
            </div>
        </g:else>
        <g:layoutBody />
    </body>
</html>
