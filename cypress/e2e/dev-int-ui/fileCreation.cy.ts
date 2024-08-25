describe('Testing environment workflow', () => {
    before(() => {
        cy.loginTargetSite(
        Cypress.env("TARGET_SITE"),
        Cypress.env("ADMIN_USERNAME"),
        Cypress.env("ADMIN_PASSWORD")
        );
    });

    it('Verify if the user can create files using node js', () => {
        cy.task('createFiles', { numberOfFiles: 5, sizeInMB: 10, directory: 'cypress/downloads' })
        .then(() => {
          cy.log('Files created successfully');
        });
    });


    after(() => {
        cy.logoutTargetSite();
        Cypress.session.clearAllSavedSessions();
    });
});