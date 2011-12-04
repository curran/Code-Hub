

<%@ page import="org.curransoft.processingdb.User" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <title>Register new ProcessingDB user</title>
    </head>
    <body>
        <center>
            <h1>New User Registration</h1>
            <g:hasErrors bean="${user}">
                <div class="errors">
                    <g:renderErrors bean="${user}"></g:renderErrors>
                </div>
            </g:hasErrors>
            <g:form action="register" name="registerForm">
                <div class="formField">
                    <label for="login">Login</label>
                    <g:textField name="login" value="${user?.login}" />
                </div>
                <div class="formField">
                    <label for="password">Password</label>
                    <g:passwordField name="password" value="${user?.password}" />
                </div>
                <div class="formField">
                    <label for="confirm">Confirm Password</label>
                    <g:passwordField name="confirm" value="" />
                </div>
                <g:submitButton class="formButton" name="register" value="register" />
            </g:form>
        </center>
    </body>
</html>
