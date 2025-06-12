
/* Plugin used: cypress-plugin-snapshots 

on the first run, it creates snapshots at the location
   on second run, it compares snapshots */
   
it('Verify the snapshot', () => {
    cy.visit('https://www.canva.com/colors/color-wheel/')
    .then(() => {
        cy.get('.OXm3WZB', {timeout: 7000})
        .should('be.visible')
        .toMatchImageSnapshot({capture: 'viewport'});
    });
});