/* Syntax
cy.stub()
cy.stub(object, method)

Yields 
cy.stub() is synchronous and returns a value (the stub) instead of a Promise-like chain-able object. 
It can be aliased.
cy.stub() returns a Sinon.js stub and hence all the sinon stub methods are available with it.

*/

describe('WORKFLOWS', () => {
    it('Create a stub and manually replace a function with this stub', () => {

        /* Never use the below way of manually overriding global functions, 
           Cypress is not able to restore them this way.
           Use second way. */

        Object.keys = cy.stub();

        let keys = Object.keys({a: 10});

        expect(Object.keys).to.be.called;
    });

    it('Replace a method with a stub', () => {
        cy.stub(Object, 'keys');

        let keys = Object.keys({a: 10});

        expect(Object.keys).to.be.called;
    });

    it('Replace a method with a function', () => {
        let flag = false;
        cy.stub(Object, 'keys').as('keyAlias').callsFake(() => {
            flag = true;
        });

        let keys = Object.keys({a: 10});

        expect(flag).to.be.true;
        cy.get('@keyAlias', {timeout: 4000}).should('have.been.calledWith', {a: 10});
    });

    it('Specify the return value of a stubbed method', () => {

        let methodReturnedByOriginalFunction = cy.stub().returns(true);

        cy.stub(Object, 'keys').as('keyAlias').returns(methodReturnedByOriginalFunction);

        /* Never use pure JS directly */
        cy.then(() => {
            Object.keys({ a: 10 });
        });

        cy.get('@keyAlias', {timeout: 4000}).should('always.returned', methodReturnedByOriginalFunction);

    });

it.only('Stub window.track when it gets defined some time later', () => {
    // Create a stub we'll use to spy on the actual method
    const trackStub = cy.stub().as('track');

    /* Yes, Object.defineProperty can override an existing property on an object, 
    but only if the property is configurable: true. 
    
        // First check if it's configurable
    const descriptor = Object.getOwnPropertyDescriptor(window, 'track');

    if (!descriptor || descriptor.configurable) {then go ahead}

    Use set() to intercept assignments
    Use get() to provide your stub
    Both are called automatically by the JS runtime, depending on how the app accesses the property
    */
    cy.visit('/', {
        onBeforeLoad(win) {
            // When the app sets window.track, override it with our stub
            Object.defineProperty(win, 'track', {
                configurable: true,
                set(fn) {
                    // Intercept and override the real implementation
                    win._originalTrack = fn;
                    win.track = trackStub;
                },
                get() {
                    return trackStub;
                }
            });
        }
    });

    // Now verify it was called with correct args
    cy.get('@track').should('have.been.calledWith', 'window.load');
});
});
