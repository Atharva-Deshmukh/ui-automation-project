/* There are two API available for adding custom commands:

- Cypress.Commands.add() - use to add a custom command to use when writing tests
- Cypress.Command.overwrite() - use to override an existing built-in Cypress command 
  or reserved internal function. Caution: this overrides it for Cypress as well and 
  could impact how Cypress behaves. */

describe('Custom command workflow', () => {
    before(() => {
        // ensure clean test slate for these tests
        // clears sessionsstorage, localstorage and cookies
        cy.then(Cypress.session.clearCurrentSessionData);

        //then start the workflow
        cy.loginTargetSite(
        Cypress.env("TARGET_SITE"),
        Cypress.env("ADMIN_USERNAME"),
        Cypress.env("ADMIN_PASSWORD")
        );
    });

    it('using a child custom command within a parent command: count menus inside the sidepanel using custom child function', () => {
        cy.get('.oxd-sidepanel').should('be.visible').countMenus();
    });

    it('using a dual custom command: a simple cy.log demonstration', () => {
        cy.log('first it block');
        cy.get('.oxd-sidepanel').should('be.visible').logWithPrefix({prefix: 'Pre', suffix: 'suff'});
        cy.logWithPrefix({prefix: 'PreWithCy', suffix: 'suffWithCy'});
    });


    after(() => {
        cy.logoutTargetSite();
    });
});