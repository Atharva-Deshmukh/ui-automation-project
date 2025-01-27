/* Iterate through an array like structure (arrays or objects with a length property).

Arguments: (value, index, collection)

No matter what is returned in the callback function, .each() will always yield the original array.

You can stop the .each() loop early by returning false in the callback function. */
describe('cy.each() Workflow', () => {   
    it('Get Cypress spec', () => {
        cy.visit('http://127.0.0.1:5500/DOM-2.html').then(() => {
            cy.get(':contains("MC")', {timeout: 60000}).should('be.visible');
        });

        /* DOM Used
              <div id="message-container">
                <p id="message1">MC - 1</p>
                <p id="message2">MC - 2</p>
                <p id="message2">MC - 3</p>
                <p id="message2">MC - 4</p>
            </div>
        */

        cy.get("#message-container p", {timeout: 60000}).should('be.visible').each(($ele, index, $list) => {
            console.warn(' ');
            console.warn('$ele -> ', $ele.text()); // $ele ->  MC - 1
            console.warn('index -> ', index); // index ->  0
            console.warn('list -> ', $list); 
            /* List
            
            {
            elements: [
                document.querySelector('#message1'),  // p#message1
                document.querySelector('#message2'),  // p#message2
                document.querySelector('#message3'),  // p#message3
                document.querySelector('#message4')   // p#message4
            ],
            length: 4,
            prevObject: document,  // The previous object is the document
            selector: "#message-container p"
            };

            */
        }).then(($lis) => {
            expect($lis).to.have.length(4) 
          });

        // If your callback function returns a Promise, it will be awaited before iterating over the next 
        // element in the collection.
        cy.wrap([1, 2, 3]).each((num, i, array) => {
            return new Cypress.Promise((resolve, reject) => {
              setTimeout(() => {
                resolve('true');
              }, (num * 100))
            })
          })
    });
});

/* DOM Used
<div class="iteration">
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
    <div class="button-wrapper">
        <button onclick="afterClick(this)">ClickMe</button><p></p>
    </div>
</div>  

There are 16 buttons
after clicking each button, a random number between 0, 10 is displayed in next element sibling after
3 seconds
*/


describe.only('Gleb Bahmutav playlist - Advanced cy.each() workflow', () => {   
  it('Click on every button and then log that number, also check if it is between [0-10]', () => {
      cy.visit('http://127.0.0.1:5500/Buttons16.html').then(() => {
          cy.get('button', {timeout: 60000}).should('be.visible');

          /* The custom .should() waits until the text inside the <p> element is no longer empty. 
          It will keep retrying every few milliseconds (Cypress automatically does this) until the 
          text is available. */

          cy.get('.button-wrapper button', {timeout: 60000}).each(($btn) => {
            cy.wrap($btn)
            .click()
            .parent()
            .find('p')
            .should(($p) => {   // wait dynamically untill the text is displayed
              const text = $p.text().trim(); // Wait until the text is no longer empty
              expect(text).to.not.be.empty; // Wait for text to be non-empty
            })
            .invoke('text').then((digit) => {
              cy.log('DIGIT LOGGED -> ', digit);
              expect(Number(digit)).to.be.within(0, 10);
            });
          });

    });
  });
});