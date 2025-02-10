/* Cypress.isCy() checks if a variable is a valid instance of cy or a cy chainable.

This utility may be useful when writing a plugin using Node Events for 
Cypress and you want to determine if a value is a valid Cypress chainable. */

describe('Workflow', () => {
   
    it('check if the element is cypress chainable', () => {
        expect(Cypress.isCy(cy.wrap({a: 'AD'}))).to.be.true;  // since wrap is chainable
        expect(Cypress.isCy(undefined)).to.be.false;
        expect(Cypress.isCy(Cypress.isCy(() => {}))).to.be.false;
    });
});
