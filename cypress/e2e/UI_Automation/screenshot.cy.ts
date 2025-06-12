

before(() => {
    cy.visit('https://www.canva.com/colors/color-wheel/')
        .then(() => {
            cy.get('.OXm3WZB', { timeout: 7000 })
                .should('be.visible');
        });
});

it('Full SS', () => {
    cy.screenshot();  /* Takes full screenshot */
});

it('Element specific SS', () => {
    cy.get('.OXm3WZB', { timeout: 7000 })
        .should('be.visible').screenshot(); 
});