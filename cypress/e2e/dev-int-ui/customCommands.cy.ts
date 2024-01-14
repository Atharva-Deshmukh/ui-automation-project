describe('Workflow for child command and dual command', () => {
    before(() => {
        cy.loginTargetSite(
        Cypress.env("TARGET_SITE"),
        Cypress.env("ADMIN_USERNAME"),
        Cypress.env("ADMIN_PASSWORD")
        );
    });

    it('using a child custom command within a parent command: count menus inside the sidepanel', () => {
        cy.get('.oxd-sidepanel').should('be.visible').countMenus();
    });

    it('using a dual custom command: a simple cy.log demonstration', () => {
        cy.get('.oxd-sidepanel').should('be.visible').logWithPrefix({prefix: 'Pre', suffix: 'suff'});
        cy.logWithPrefix({prefix: 'PreWithCy', suffix: 'suffWithCy'});
    });


    after(() => {
        cy.logoutTargetSite();
    })
});