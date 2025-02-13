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

    it('Using plugin', () => {
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
        });
    });

    /* This works only for menus that are hidden
    cy.get().invoke(show) 
    get() should be applied on immediate parent element of our hidden target
    because jquery works on immediate child */
    it('Using invoke("show")', () => {
        // this should be there on immediate parent element
        cy.visit('https://www.yatra.com/', {timeout: uiTimeout}).then((winObj) => {
            expect(winObj.navigator.language).to.eq('en-US');

            cy.get('.MuiBox-root.css-1ptymfd', {timeout: uiTimeout})
            .invoke('show')
            .then(($ele) => {
                cy.contains('My Bookings').click({force: true})
            })
        });
    });

    // using cypress' ability to click hidden DOM elements
    it.only('Using click({force: true})', () => {
        // use it on hidden elements and when u don't want to waste time on loading those elements
        cy.visit('https://github.com/Himu143/WebAutomation-OrangeHRM-With-Selenium-TestNG').then((winObj) => {
            expect(winObj.navigator.language).to.eq('en-US');

            cy.get('span.ActionListItem-label:contains("Issues")').click({force: true});
        })
    });
});
               