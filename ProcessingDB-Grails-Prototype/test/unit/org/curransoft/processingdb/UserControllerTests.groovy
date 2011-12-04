package org.curransoft.processingdb

import grails.test.*

class UserControllerTests extends ControllerUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

     void testPasswordsMatch() {
        mockRequest.method = 'POST'
        mockDomain(User)
        mockParams.login = 'joe'
        mockParams.password = 'schmo'
        mockParams.confirm = 'schmoe'
        
        def model = controller.register()

        assert(model?.user)
        def user = model.user
        assert user.hasErrors()
        assertEquals("user.password.dontmatch", user.errors.password)
        
    }
}
