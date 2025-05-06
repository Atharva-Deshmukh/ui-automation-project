/* 
SYNTAX: (same as dblclick, rightclick)

.click()
.click(options)
.click(position)
.click(position, options)
.click(x, y)
.click(x, y, options)

.click() yields the same subject it was given.

Specify a corner of the element to click

cy.get('img').click('topRight')
The center position is the default position. 
Valid positions:
topLeft, top, topRight, left, center, right, bottomLeft, bottom, and bottomRight.

Coordinates: ORIGIN: top left corner
The click below will be issued inside of the element 
(15px from the left and 40px from the top).
    cy.get('#top-banner').click(15, 40)

Force a click with relative coordinates
    cy.get('#footer .next').click(5, 60, { force: true })


Click all elements with id starting with 'btn'
By default, Cypress will give error if you're trying to click multiple elements. 
By passing { multiple: true } Cypress will iteratively apply the click to each 
element and will also log to the Command Log multiple times.

cy.get('[id^=btn]').click({ multiple: true })

                                    KEY COMBINATIONS
                                    ---------------

// execute a SHIFT + click on the first <li>
    cy.get('li:first').click({
    shiftKey: true,
    })

// execute ALT + dblclick on the first <li>
    cy.get('li:first').dblclick({
    altKey: true,
    })

In Windows, the Meta key is referred to as the Windows key

// execute a CMD + right click on the .menu-item
    cy.get('.menu-item').rightclick({
    metaKey: true,
    })

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('WORKFLOWS', () => {
        /* Holding a key */
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