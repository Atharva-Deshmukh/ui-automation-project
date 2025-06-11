const uiTimeout: number = 5000;

it('Verify the wheel snapshot', () => {
    cy.visit('https://www.w3schools.com/css/css_colors.asp', {timeout: uiTimeout})
    .then(() => {
        cy.get('.w3-row.w3-center', {timeout: uiTimeout})
        .toMatchImageSnapshot();
    });
});