describe('Testing environment workflow', () => {
    before(() => {
      cy.task('writeFile', { filePath: 'cypress/downloads', sizeInMB: 5 })
      .then(() => {
        cy.log('PDF created successfully');
      });
    });

    it('Verify if the user can create files using node js', () => {
        cy.task('createFiles', { numberOfFiles: 5, sizeInMB: 10, directory: 'cypress/downloads' })
        .then(() => {
          cy.log('Files created successfully');
        });
    });

    it.only('Verify if the user can create PDF', () => {
       cy.log('hi')
    });


    // after(() => {
    //     cy.logoutTargetSite();
    //     Cypress.session.clearAllSavedSessions();
    // });
});