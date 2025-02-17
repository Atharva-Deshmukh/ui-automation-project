import { uiTimeout } from "../../fixtures/commonData";

it('ERROR -> Mixing sync and async code', () => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
    cy.get('h1', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('text')
    .then((text) => {
        cy.log('text -> ' + text);
        return text;
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

it.only('RESOLVED -> Mixing sync and async code', () => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
    cy.get('h1', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('text')
    .then((text) => {
        return text;
    })
    .should('equal', 'Practice Page');
});