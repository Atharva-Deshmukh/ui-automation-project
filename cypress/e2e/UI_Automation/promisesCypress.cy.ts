import { uiTimeout } from "../../fixtures/commonData";

it('console.log() and other cypress commands', () => {
    cy.visit('https://testrigor.com/', {timeout: uiTimeout});
    console.warn('I AM NON-CYPRESS COMMAND');  // this is logged even before the visit
    cy.get('.text-red', {timeout: uiTimeout})
    .should('be.visible');

    /*
    Cypress is async in nature but it manages to print everything sequentially ONLY IF everything is 
    cypress command and the promises are handled properly.
    But here, console.warn() is a non cypress pure JS command which is where cypress fails to handle it 
    synchronously.
    */
});

// NOTE: DON'T use native JS promises, there will be version issue with bluebird
// package, use Cypress.Promise

it('Returning promises', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({name: name});
            }, delayInMS);
        });
    }

    delayedFunc('ATHARVA', 3000);

    console.warn('PROMISE END ....');

    /* OUTPUT:

    Cypress runner: No commands were issued in this test.

    console: 
    PROMISE START ....
    PROMISE END ....
    
    Cypress schedules executions of commands first and then executes, but JS things and non-cypress
    things get run in that time slab

    Promises are run as soon as JS starts running, they are kind of non-cypress 
    so, cypress don't know that we have to wait for the promise to resolve */
});

it('Workaround - 1', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({name: name});
            }, delayInMS);
        });
    }

    cy.wrap(delayedFunc('ATHARVA', 3000));  // we tell cypress to wait for promise to resolve first

    console.warn('PROMISE END ....');

    /* OUTPUT:

    Cypress runner: wrapObject{6}  // this appears after log

    console: 
    PROMISE START ....   THESE logs are appearing before, there is no chaining happening
    PROMISE END ....
    
    Promises are run as soon as JS starts running, they are kind of non-cypress 
    so, cypress don't know that we have to wait for the promise to resolve */
});

it('Workaround - 2', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({name: name});
            }, delayInMS);
        });
    }

    // we are chaining and also verifing the yeilds of promise
    // Now everything happens sequentially
    cy.wrap(delayedFunc('ATHARVA', 3000)).then((resp) => {
        expect(resp).to.haveOwnProperty('name', 'ATHARVA')
        console.warn('PROMISE END ....');
    }); 
});

it('Chaining promises with other cypress commands', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({name: name});
            }, delayInMS);
        });
    }

    cy.visit('https://testrigor.com/', {timeout: uiTimeout}).then(() => {
            // we are chaining and also verifing the yeilds of promise
            // Now everything happens sequentially
            cy.wrap(delayedFunc('ATHARVA', 3000)).then((resp) => {
                expect(resp).to.haveOwnProperty('name', 'ATHARVA')
                console.warn('PROMISE END ....');
            }); 
    });

    /* SEQUENCE OF EXECUTION

    visited URL first, let it fully render
    PROMISE START ....   THESE logs are appearing before, there is no chaining happening
    PROMISE END .... */
});

it('WAITING and Validating multiple promises at once', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(name);
            }, delayInMS);
        });
    }

    // Promise.all() resolves its results in the same order as the promises were passed in, 
    // not in order of completion.

    cy.wrap(Cypress.Promise.all([
        delayedFunc('5-sec - 5', 5000),
        delayedFunc('3-sec - 3', 3000),
        delayedFunc('4-sec - 4', 4000),
    ])).then((resp) => {
        expect(resp).to.have.lengthOf(3);
        expect(resp[0]).to.equal('5-sec - 5');
        expect(resp[1]).to.equal('3-sec - 3');
        expect(resp[2]).to.equal('4-sec - 4');
    });

    cy.log('EVERYTHING FINISHED');
});

it('Dealing with rejected promises', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                reject(name);
            }, delayInMS);
        });
    }
    // error will be thrown
    cy.wrap(delayedFunc('ATHARVA', 3000));
    cy.log('EVERYTHING FINISHED');
});

it.only('COMMON ERROR - cy. commands inside promises', () => {

    function delayedFunc(name: string, delayInMS: number) {
        console.warn('PROMISE START ....');

        // same result even if we return new promise
        return new Cypress.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(name);
                cy.log('I AM INSIDE PROMISE')
            }, delayInMS);
        });
    }
    cy.wrap(delayedFunc('ATHARVA', 3000));
    cy.log('EVERYTHING FINISHED');

/* Common Error thrown:
The following error originated from your test code, not from Cypress.
> Cypress detected that you returned a promise from a command while also invoking one or more cy 
 commands in that promise.
The command that returned the promise was:
> cy.wrap()
The cy command you invoked inside the promise was:
> cy.log()
Because Cypress commands are already promise-like, you don't need to wrap them 
or return your own promise. 

Dealt separately here: cypress\e2e\CYPRESS TRICKS\MixingAsyncAndSyncCode.cy.ts */
});