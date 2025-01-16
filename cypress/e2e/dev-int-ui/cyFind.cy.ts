/*  cy.find() Gets the descendent DOM elements of a specific selector.

DOM USED:

body>
  <div id="message-container">
    <p id="message1">Message Container - 1</p>
    <p id="message2">Message Container - 2</p>
  </div>

  <div id="div-1">
    <p id="mess1">inside div: 1</p>
    <div id="div-2" class="AD">
      <p id="mess2">inside div: 2</p>
      <div id="div-3">
        <p id="mess3">inside div: 3</p>
     </div>
    </div>
  </div>

  <div id="message....container">
    Contains ...
  </div>

  <div id="message::container">
    Contains ::
  </div>
</body>

*/

describe('cy.find() workflows', () => {
    it.only("find examples", () => {
        cy.visit('http://127.0.0.1:5500/DOM.html').then(() => {
            cy.get('#message-container', {timeout: 60000}).should('be.visible').find('p').should('have.length', 2).then(($ele) => {
                console.warn('ELE -> ', $ele);
                /* Cypress Jquery object
                const jqueryObject = {
                    0: 'p#message1',
                    1: 'p#message2',
                    length: 2,
                    prevObject: {
                        0: 'div#message-container',
                        length: 1,
                        prevObject: {
                        length: 1, // Represents jQuery.fn.init(1), which includes only `document`
                        0: 'document',
                        __proto__: Object.prototype
                        },
                        __proto__: Object.prototype
                    },
                    selector: 'p',
                    __proto__: Object.prototype
                    };
                
                */

                console.warn('OUTER HTML ', $ele[0].outerHTML)
                // <p id="message1">Message Container - 1</p>

                // .find('>li')
                /*
                <div id="message-container">
                    <p>Direct child paragraph</p> <!-- This will match -->
                    <div>
                        <p>Nested paragraph</p> <!-- This will NOT match -->
                    </div>
                </div>

                */
                cy.get('#message-container', {timeout: 60000}).should('be.visible').find('>p').should('have.length', 2)
            });
        });
    });
});