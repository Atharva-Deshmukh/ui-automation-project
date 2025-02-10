import { uiTimeout } from "../../fixtures/commonData";

// elements should actually exist in DOM, if they don't, use should(not exist)
describe('Hidden or invisible elements Cypress', () => {

    it('Hide and show on button click example', () => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});

        cy.get('legend:contains("Element Displayed Example")', {timeout: uiTimeout}).should('be.visible');
        
        cy.get('input[name="show-hide"]', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Hide/Show Example');
        
        cy.get('input#hide-textbox', {timeout: uiTimeout}).should('be.visible').click();

        cy.get('input[name="show-hide"]', {timeout: uiTimeout})
        .should('not.be.visible')

        // cy.get('input[name="show-hide"]', {timeout: uiTimeout})  // doesn't work since element is there in DOM
        // .should('not.exist')

        cy.get('input[name="show-hide"]', {timeout: uiTimeout})  // another way
        .invoke('show').then(($ele) => {
            cy.wrap($ele).should('be.visible') 
        })

        // we can also use cy.get(':hidden') for hidden elements, it doesn't work sometines

        cy.get('input#show-textbox', {timeout: uiTimeout}).should('be.visible').click();
 
        cy.get('input[name="show-hide"]', {timeout: uiTimeout})
        .should('be.visible')

    });

});