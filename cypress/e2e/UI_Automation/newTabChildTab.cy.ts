import { uiTimeout } from "../../fixtures/commonData";


it('Way-1: By Changing HTML', () => {
    // we try to open the new tab/page in the same page itself
    cy.visit('https://selectorshub.com/xpath-practice-page/', {timeout: uiTimeout});
    cy.get('a:contains("Find out how to automate these controls without XPath")', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('removeAttr', 'target')
    .click()
    .then(() => {
        // actual URL includes query params, so match this much part only, use include
        cy.url().should('include', 'testrigor.com');

        // Another way: .invoke('attr', 'target', '_self')

        // cy.visit() will NEVER allow cross origin for security purpose and cypress' architecture limitation
        // hence even if we m
    });
});