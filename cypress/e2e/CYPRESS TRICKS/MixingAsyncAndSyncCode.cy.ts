import { uiTimeout } from "../../fixtures/commonData";

it('ERROR -> Mixing sync and async code', () => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
    cy.get('h1', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('text')
    .then((text) => {
        cy.log('text -> ' + text); // async part
        return text;              // sync part
    })
    .should('equal', 'Practice Page');

    /* Error issued:

    cy.then() failed because you are mixing up async and sync code.
    In your callback function you invoked 1 or more cy commands but then 
    returned a synchronous value.
    
    Reason:
    - should() is expecting a yeilded value and cypress confuses in what to
      return, cy.log() or return text */
});

it('RESOLVED -> Mixing sync and async code', () => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
    cy.get('h1', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('text')
    .then((text) => {
        return text;
    })
    .should('equal', 'Practice Page');
});

/* Error:

cy.then() failed because you are mixing up async and sync code.
In your callback function you invoked 1 or more cy commands but then returned a synchronous value.

Cypres confuses whether to return 200 or 20, hence chain properly

*/
it.only('Mixing sync and async code', () => {
    cy.wrap(100).then(() => {
        cy.wrap(200);
        return 20;
    }).should('eq', 200);

    cy.wrap(100).then(() => {
        cy.wrap(200);
    }).should('eq', 200);

    // One more thing: cy.log() changes subject to null, hence chain it carefully
    // here below command gives ERROR: expected null to equal 200
    cy.wrap(100).then(() => {
        cy.wrap(200)
        .log('wait');
    }).should('eq', 200);

    cy.wrap(100).then(() => {
        cy.log('wait');
    }).should('eq', null);


});