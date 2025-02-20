import { uiTimeout } from "../../fixtures/commonData";

let text: string = 'Hi I am Atharva';

// we use cy.window()
it('Copy text to clipboard and then verify it', () => {
    cy.visit('https://www.w3schools.com/howto/howto_js_copy_clipboard.asp', {timeout: uiTimeout});
    cy.get('#myInput', {timeout: uiTimeout})
    .should('be.visible')
    .clear()
    .type(text);

    cy.get('.tooltip > .w3-button', {timeout: uiTimeout})
    .should('be.visible')
    .click('center')
    .then(($btn) => {

        // To reveal the tooltip to indicate if the text is copied
        cy.wrap($btn).realHover();


        cy.wait(2000);
        // verify that popup and check what is copied
        cy.get('span.tooltiptext', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.text', 'Copied: ' + text);

        // access clipboard and verify it
        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((textRead) => {
                expect(textRead).to.eq(text);
            })
        });
    });
}); 