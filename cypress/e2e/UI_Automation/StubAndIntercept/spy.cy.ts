/* Wrap a method in a spy in order to record calls to and arguments of 
the function.

Spy is usually used during unit testing

cy.spy() is a utility function, and is not a Cypress command, query or assertion. 
It is not retryable, chainable, or timeout-able.

Syntax:
cy.spy(object, method)

Ex
cy.spy(user, 'addFriend')
cy.spy(user, 'addFriend').as('addFriend')

Arguments:
 object (Object): The object that has the method to be wrapped.
 method (String): The name of the method on the object to be wrapped.

// assume App.start calls util.addListeners
    cy.spy(util, 'addListeners')
    App.start()
    expect(util.addListeners).to.be.called

Automatic reset/restore between tests

                            Difference between cy.spy() and cy.stub()
cy.spy() does not replace the method, it only wraps it. So, while invocations are recorded, 
the original method is still called. This can be very useful when testing methods on native browser objects. 
You can verify a method is being called by your test and still have the original method action invoked.

*/

import { uiTimeout } from "../../../fixtures/commonData";

describe('WORKFLOWS', () => {
    it('Lets spy on console function', () => {
        let str: string = 'Hello SDET';
        
        cy.spy(console, 'log').as('logAlias');

        console.log(str);

        cy.get('@logAlias').should('be.calledOnceWith', str);
    });

    it('Lets spy on a function that is executed after delay', () => {
        let str: string = 'Hello SDET';

        cy.spy(console, 'log').as('logAlias');

        setTimeout(() => {
            console.log(str);
        }, 7000);

        cy.get('@logAlias', {timeout: uiTimeout}).should('be.calledOnceWith', str);
    });

    it('Lets spy on a function that is called with object', () => {
        let obj: any = {id: '12', name: 'AD'};

        cy.spy(console, 'log').as('logAlias');

        console.log(obj);

        cy.get('@logAlias', {timeout: uiTimeout}).should('be.calledWith', obj);
    });
});