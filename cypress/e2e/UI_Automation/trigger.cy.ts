import { uiTimeout } from "../../fixtures/commonData";

describe('WORKFLOWS', () => {

    it('Triggerring commands vs Normal action commands', () => {
        cy.visit('https://practice.expandtesting.com/radio-buttons', { timeout: uiTimeout }).then((winObj) => {
            expect(winObj.navigator.language).to.eq('en-US');

            /* Both types commands will first verify element actionability, but only the "true" action 
            commands will implement all of the default actions of the browser, and additionally perform 
            low level actions to fulfill what's defined in the spec. 
            .trigger() will only fire the corresponding event and do nothing else.
            That means that your event listener callbacks will be invoked, but don't expect the browser 
            to actually "do" anything for these events. For the most part, it shouldn't matter, which 
            is why .trigger() is an excellent stop-gap if the command / event you're looking for hasn't 
            been implemented yet. */

            // cy.get('input#yellow', { timeout: uiTimeout })
            //     .should('be.visible')
            //     .click()
            //     .then(($ele) => {
            //         cy.wrap($ele).should('be.focused')
            //     })

            // Does not trigger default browser behaviors like focusing an input on click.
            cy.get('input#yellow', { timeout: uiTimeout })
                .should('be.visible')
                .trigger('click')
                .then(($ele) => {
                    cy.wrap($ele).should('be.focused')
                })
        });
    });

    /* Trigger an event on a DOM element. yields the same subject it was given.*/
    describe('MouseEvents', () => {
        it('HOVERING: mouseover event to trigger hover', () => {
            cy.visit('https://practice.expandtesting.com/hovers', { timeout: uiTimeout }).then((winObj) => {
                expect(winObj.navigator.language).to.eq('en-US');


                // Using plugin - realhover()
                cy.get('img[alt="User Avatar"]', { timeout: uiTimeout })
                    .first()
                    .should('be.visible')
                    .realHover({ position: 'center' })
                    .then(() => {
                        cy.get('h5:contains("name: user1")', { timeout: uiTimeout })
                            .should('be.visible')
                    })

                // this hovering doesn't work many times
                // cy.get('img[alt="User Avatar"]', {timeout: uiTimeout})
                // .first()
                // .should('be.visible')
                // .trigger('mouseover', 'center')
                // .then(() => {
                //     cy.get('h5:contains("name: user2")', {timeout: uiTimeout})
                //     .should('be.visible')
                // })
            });
        });

        it('HOVERING: mouseover event on some other site', () => {
            cy.visit('https://practice-automation.com/hover/', { timeout: uiTimeout }).then((winObj) => {
                expect(winObj.navigator.language).to.eq('en-US');


                // Using plugin - realhover()
                cy.get('h3#mouse_over', { timeout: uiTimeout })
                    .first()
                    .should('be.visible')
                    .realHover({ position: "center" })
                    .then(() => {
                        // use contains to yeild that element if it dissapears after hover
                        cy.contains('You did it!').should('be.visible')
                            .then(($ele) => {
                                cy.wrap($ele).should('have.css', 'color', 'rgb(0, 128, 0)')
                            });
                    });
            })
        });

        it('LONG PRESS BUTTON and release', () => {
            cy.visit('https://practice.expandtesting.com/radio-buttons', { timeout: uiTimeout }).then((winObj) => {
                expect(winObj.navigator.language).to.eq('en-US');

                // THIS WORKS
                // cy.get('input#yellow', { timeout: uiTimeout })
                //     .should('be.visible')
                //     .click()

                // It doesn't work, hence using the pluggin
                // cy.get('input#yellow', { timeout: uiTimeout })
                //     .should('be.visible')
                //     .trigger('mousedown')
                //     .wait(2000)
                //     .trigger('mouseup');

                // THIS WORKS ALWAYS!
                cy.get('input#yellow', { timeout: uiTimeout })
                    .should('be.visible')
                    .realMouseDown()
                    .wait(2000)
                    .realMouseUp()

                    /* Some Additional Notes

                    // Main button pressed (usually the left button)
                    cy.get('.target').trigger('mousedown', { button: 0 })
                    // Auxiliary button pressed (usually the middle button)
                    cy.get('.target').trigger('mousedown', { button: 1 })
                    //Secondary button pressed (usually the right button)
                    cy.get('.target').trigger('mousedown', { button: 2 }) */
            });
        });
    });

    describe('Handling slider inputs', () => {
        // Dealt separately
    });

    describe('Handling Drag and drop', () => {
        // Dealt separately
    });
});

