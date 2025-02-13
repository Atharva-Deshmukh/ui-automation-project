import { uiTimeout } from "../../fixtures/commonData";

describe('CYPRESS HOVERING', () => {

    // This approach don't works many times
    it('using trigger(mouseover)', () => {
            cy.get('h3#mouse_over', {timeout: uiTimeout})
                .first()
                .should('be.visible')
                .trigger('mouseover', 'center')
                .then(($ele) => {
                cy.wrap($ele).invoke('css', 'color').then((val) => {
                    expect(val).to.equal('green')
                });
            });
    });

    cy.visit('https://practice-automation.com/hover/', {timeout: uiTimeout}).then((winObj) => {
        expect(winObj.navigator.language).to.eq('en-US');


        // Using plugin - realhover()
        cy.get('h3#mouse_over', {timeout: uiTimeout})
        .first()
        .should('be.visible')
        .realHover({position: "center"})
        .then(() => {
            // use contains to yeild that element if it dissapears after hover
            cy.contains('You did it!').should('be.visible')
            .then(($ele) => {
                cy.wrap($ele).should('have.css', 'color', 'rgb(0, 128, 0)')
            });
        });
    })
});
               