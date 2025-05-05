/* Iterate through an array like structure (arrays or objects with a length property).

Arguments: (value, index, collection)

No matter what is returned in the callback function, .each() will always yield the original array.

You can stop the .each() loop early by returning false in the callback function. 


NOTE THAT:
cypress's each(element, index) is different, it is used in cypress elements only
for pure jquery elements, we have a separate each(index, element)
*/
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

/*  ----------------------------      ADVANCED cy.each()  ---------------------------

DOM Used
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
  it.only('How to break each($ele)', () => {

    /* You can iterate any array also and also break the loop for index only, not for element
    Cypress does not stop execution based on element values because return false; only affects 
    .each() when used based on index, NOT the element itself. */
    cy.wrap(['a', 'b', 'c', 'd', 'e', 'f']).each(($ele, index) => {
        cy.log('ELE -> ', $ele);
        if(index === 2) {
            return false;
        }
    });

    /* INTERVIEW QUESTION
    
      When we try to break loop inside any command, then we cannot break each().

       All the commands in cy.each() is queued up beforehand for each element for each()

       below console prints all buttons-[0,1,2...9] befoehand itself,
    */

    cy.visit('http://127.0.0.1:5500/Buttons16.html').then(() => {
          cy.get('button', {timeout: 60000}).should('be.visible');
          cy.get('.button-wrapper button', {timeout: 60000}).each(($btn, index) => {
            console.log('Button -> ', index)
            cy.wrap($btn)
            .click()
            .parent()
            .find('p')
            .should(($p) => {   
              const text = $p.text().trim(); 
              expect(text).to.not.be.empty; 
            })
            .invoke('text').then((digit) => {
              cy.log('DIGIT -> ', digit);
              if(digit === '7') return false;
            });
          });
    });

    /* How to stop this queueing then? use a variable before each()

    and use cy.then()

    Unlike direct Cypress commands inside .each(), cy.then() ensures commands inside it execute sequentially 
    rather than scheduling all at once.

    This means the if(shouldStop === true) return; check actually stops further iterations dynamically.

    Cypress runs .then() sequentially

    Cypress waits for the previous .then() block to finish before executing the next one inside .each(). 
    This enables stopping dynamically.
    
    */
    cy.visit('http://127.0.0.1:5500/Buttons16.html').then(() => {
        cy.get('button', {timeout: 60000}).should('be.visible');

        let shouldStop: boolean = false;
        cy.get('.button-wrapper button', {timeout: 60000}).each(($btn, index) => {
         cy.then(() => {

            if(shouldStop === true) return

            console.log('Button -> ', index)
            cy.wrap($btn)
            .click()
            .parent()
            .find('p')
            .should(($p) => {  
              const text = $p.text().trim(); 
              expect(text).to.not.be.empty; 
            })
            .invoke('text').then((digit) => {
              cy.log('DIGIT -> ', digit);
              if(digit === '7') shouldStop = true;
            });
         })
        });
  });

  });
});