describe('Testing environment workflow', () => {
    before(() => {
        cy.loginTargetSite(
        Cypress.env("TARGET_SITE"),
        Cypress.env("ADMIN_USERNAME"),
        Cypress.env("ADMIN_PASSWORD")
        );
    });

    it('if the user can log the secret environment variable', () => {
        cy.log(Cypress.env('SECRET_1'));
        cy.log(Cypress.env('SECRET_2'));
    });


    after(() => {
        cy.logoutTargetSite();
        Cypress.session.clearAllSavedSessions();
    });
});