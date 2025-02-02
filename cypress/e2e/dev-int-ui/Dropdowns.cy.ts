import { uiTimeout } from "../../fixtures/commonData";

describe('Handling dropdowns in Cypress', () => {
    it("Traditional Dropdowns with <select>", () => {
        cy.visit('https://www.zoho.com/commerce/free-demo.html', {timeout: uiTimeout}).then(() => {
            cy.get('h1:contains("Witness Zoho Commerce in action")', {timeout: uiTimeout}).should('be.visible');

            cy.get('#zcf_address_country', {timeout: uiTimeout})
            .should('be.visible')
            .should('have.value', 'India')  // checks the selected value
            .select('Zimbabwe')             // selects by value
            .should('have.value', 'Zimbabwe');
        });
    });

    it.only("Bootstrap Dropdowns i.e. without <select>", () => {

        /*
        
        */
        cy.visit('https://www.dummyticket.com/dummy-ticket-for-visa-application/', {timeout: uiTimeout}).then(() => {
            cy.get('p:contains("Dummy ticket booking")', {timeout: uiTimeout})
            .should('be.visible');

            // cy.get('#zcf_address_country', {timeout: uiTimeout})
            // .should('be.visible')
            // .should('have.value', 'India')  // checks the selected value
            // .select('Zimbabwe')             // selects by value
            // .should('have.value', 'Zimbabwe');
        });
    });
});