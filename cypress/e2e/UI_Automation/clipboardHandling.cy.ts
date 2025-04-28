import { uiTimeout } from "../../fixtures/commonData";

it('Copy text to clipboard and then verify it', () => {
    cy.visit('https://clipboardjs.com/', {timeout: uiTimeout});
    cy.get('p:contains("You can get it on npm.") + .snippet .btn').realHover().then(($btn) => {
        cy.wrap($btn).should('be.visible')
        .click()
        .then(() => {
            cy.window().then((win) => {
                win.navigator.clipboard.readText().then((text) => {
                    expect(text).to.eq('npm install clipboard --save');
                });
            });
        });
    });
}); 