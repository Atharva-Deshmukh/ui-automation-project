describe('Testing environment workflow', () => {
    before(() => {
        cy.loginTargetSite(
        Cypress.env("TARGET_SITE"),
        Cypress.env("ADMIN_USERNAME"),
        Cypress.env("ADMIN_PASSWORD")
        );
    });

    it('Verify if the user can log the secret environment variable', () => {

// COMMAND RUN IN BASH -> CYPRESS_SECRET_1=Atharva CYPRESS_SECRET_2=Deshmukh yarn run cypress open
        cy.log(Cypress.env('SECRET_1'));
        cy.log(Cypress.env('SECRET_2'));
    });


    after(() => {
        cy.logoutTargetSite();
        Cypress.session.clearAllSavedSessions();
    });
});