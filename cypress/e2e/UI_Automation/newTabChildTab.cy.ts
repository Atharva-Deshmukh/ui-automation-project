import { uiTimeout } from "../../fixtures/commonData";

/* Whenever target = _blank, link will open in a new page, so we remove it in order to open new link in the 
   same page 
   

   NOTE:
   - Domains should match, cypress doesn't support different domains
*/

it('Way-1: Removing target = _blank', () => {
    // we try to open the new tab/page in the same page itself
    cy.visit('https://selectorshub.com/xpath-practice-page/', {timeout: uiTimeout});
    cy.get('a:contains("Find out how to automate these controls without XPath")', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('removeAttr', 'target').then(($link) => {
        cy.wrap($link).click();
    })
    .then(() => {
        // actual URL includes query params, so match this much part only, use include
        cy.url().should('include', 'testrigor.com');
    }).then(() => {
        cy.go('back').then(() => {
            cy.url().should('include', 'selectorshub');
        });

        /* Added this in e2e.ts file to prevent test from failing,
        This was a site issue not from cypress

        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('postMessage')) {
                return false; // prevent test from failing
            }
        });
        
        */
    });
});

it('Way-2: Setting target = _self also opens link in same page', () => {

    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    // we try to open the new tab/page in the same page itself
    cy.visit('https://selectorshub.com/xpath-practice-page/', {timeout: uiTimeout});
    cy.get('a:contains("Find out how to automate these controls without XPath")', {timeout: uiTimeout})
    .should('be.visible')
    .invoke('attr', 'target', '_self').then(($link) => {
        cy.wrap($link).click();
    })
    .then(() => {
        // actual URL includes query params, so match this much part only, use include
        cy.url().should('include', 'testrigor.com');
    });
});