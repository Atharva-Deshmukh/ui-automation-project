describe('Get Cypress testingType', () => {

    // Cypress.testingType // returns 'e2e' or 'component'
   
    it('Get Cypress testingType', () => {
        cy.log(Cypress.testingType); // e2e
    });
});
