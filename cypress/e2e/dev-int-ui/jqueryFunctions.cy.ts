/* the jQuery element object in Cypress ($ele) is similar but not exactly the same as a jQuery 
object created using the standalone jQuery library.

Cypress automatically includes jQuery, so elements you access with .then() or .within() are 
wrapped as jQuery objects.

You can use all standard jQuery methods on these elements (e.g., .text(), .val(), .css()).

                                -------------------------------------------------
                            Is $ele, in cypress jquery syncrhonous or asynchronous?
                                -------------------------------------------------
In Cypress, $ele (the jQuery-wrapped element inside .then() or .within()) operates synchronously. 
However, Cypress commands like .get() or .find() that resolve to $ele are asynchronous.
Cypress commands like cy.get() are asynchronous because they involve retries and wait for elements to meet 
certain conditions (e.g., visibility, existence in the DOM).
Cypress uses a built-in retry mechanism to ensure the DOM is in the desired state before continuing execution.

cy.get('.my-class').then(($ele) => {
  // Cypress waited until '.my-class' was available in the DOM
});


Once Cypress has resolved the command (e.g., cy.get()), it passes a synchronous jQuery-wrapped element ($ele) 
to the .then() or .within() callback.
All operations on $ele (like $ele.text(), $ele.attr()) execute immediately without retries or waiting.

cy.get('.my-class').then(($ele) => {
  const text = $ele.text(); // Synchronous
  cy.log(text);            // Executes immediately
});

--------------------------------------------------------------------------------------------------
                                                NOTE
--------------------------------------------------------------------------------------------------

You CANNOT chain Cypress commands on $ele directly. 
cy.get('.my-class').find('.child') is valid
$ele.find('.child') is invalid and cannot be followed by Cypress commands.

If you need to chain Cypress commands, you must use cy.wrap() to reintroduce the 
asynchronous Cypress behavior:

cy.get('.my-class').then(($ele) => {
  cy.wrap($ele).find('.child').click(); // Makes '.find()' asynchronous
});

$ele.text() includes all descendant text nodes but does not return HTML tags or attributes.

*/

describe('Workflow for cypress jquery functions', () => {

    /* For elements like <div>, <span>, or <p>, which contain text but not a value attribute, 
    you should use .text() (jQuery) or .invoke('text') */
    describe('$ele.text()', () => {
        /* This method retrieves the text content of a selected element, including the text of its descendants.*/
        it('$ele.text() to extract text of SINGLE element', () => {
            cy.visit('https://www.automationexercise.com/').then(() => {
                cy.get('a:contains("Home")', { timeout: 60000 }).should('be.visible');
            });

            cy.get('.carousel-inner h1:first', { timeout: 60000 }).should('be.visible').then(($ele) => {
                expect($ele.text()).to.eq('AutomationExercise');
            });

            /* invoke way:
            .invoke('text') simplifies the process by directly calling the jQuery text() method without wrapping 
            it in a .then().*/
            cy.get('.carousel-inner h1:first', { timeout: 60000 }).should('be.visible').invoke('text').then((text) => {
                expect(text).to.eq('AutomationExercise');
            });
        });

        /* DOM USED:

          <div id="message-container">
            <p id="message1">Message Container - 1</p>
            <p id="message2">Message Container - 2</p>
            <h4>H4 text 1</h4>
            <h4>H4 text 2</h4>
            <div>
                <h2>H2 text INSIDE DIV</h2>
            </div>
          </div>
        */
        it('$ele.text() to extract text of DESCENDANT elements', () => {
            cy.visit('http://127.0.0.1:5500/DOM.html').then(() => {
                cy.get(':contains("Container")', { timeout: 60000 }).should('be.visible');
            });

            // DOM's div also include blank text, hence need to trim
            cy.get('#message-container', { timeout: 60000 }).should('be.visible').then(($ele) => {
                console.warn('MULTI-TEXTs ', $ele.text());
                /* O/P

                Message Container - 1
                Message Container - 2
                H4 text 1
                H4 text 2
                
                H2 text INSIDE DIV */
            });
        });
        it('$ele.text() to extract text of MULTIPLE elements', () => {
            cy.visit('http://127.0.0.1:5500/DOM.html').then(() => {
                cy.get(':contains("Container")', { timeout: 60000 }).should('be.visible');
            });

            let txtArr: string[] = [];
            cy.get('#message-container p', { timeout: 60000 }).should('be.visible').each(($el, index, $list) => {
                txtArr.push($el.text());
            }).then(() => {
                // ['Message Container - 1', 'Message Container - 2']
                console.warn('txtArr -> ', txtArr)  // ops are asynchronous hence chain in then()
                expect(txtArr).to.have.length(2);
            });
        });
    });

    /* The .val() method in jQuery is specifically designed to retrieve or set the value of form elements like:
        <input> elements (e.g., text, password, hidden, etc.)
        <textarea> elements
        <select> elements
        It does not work for non-input elements such as <div>, <span>, or other HTML elements that do not 
        have a value attribute. */
    describe('$ele.val()', () => {
        before(() => {
            cy.visit('http://127.0.0.1:5500/INPUTS_DOM.html', { timeout: 60000 });
        });

        /* DOM USED:
   
            <input type="text" id="username" name="username" value="AD" placeholder="AD"> <br>
            <input type="password" id="password" name="password" value="12345"> <br>
            <input type="checkbox" id="subscribe" name="subscribe" value="yes" checked> <br>
            <input type="radio" id="option1" name="choice" value="A" checked> <br>
            <input type="radio" id="option2" name="choice" value="B"> <br>
            <textarea id="comments" name="comments">TEXT AREA</textarea> <br>
            <select id="colors" name="colors"> 
                <option value="red">Red</option>
                <option value="blue" selected>Blue</option>
                <option value="green">Green</option>  */

        it('$ele.val() for inputs and also invoke workflow', () => {
            cy.get('input[name="username"]').then(($ele) => {
                const value = $ele.val(); // Retrieves "AD"
                expect(value).to.eq('AD');
            });
            cy.get('input[name="username"]').invoke('val').then((value) => {
                expect(value).to.eq('AD');
            })

            cy.get('input[name="subscribe"]').should('be.checked').then(($ele) => {
                expect($ele.val()).to.eq('yes');
            });
            cy.get('input[name="subscribe"]').should('be.checked').invoke('val').then((value) => {
                expect(value).to.eq('yes');
            });

            cy.get('textarea[name="comments"]').then(($ele) => {
                expect($ele.val()).to.eq('TEXT AREA');
            });
            cy.get('textarea[name="comments"]').invoke('val').then((value) => {
                expect(value).to.eq('TEXT AREA');
            });
              
            cy.get('select[name="colors"]').then(($ele) => {
                expect($ele.val()).to.eq('blue');
            });
            cy.get('select[name="colors"]').invoke('val').then((value) => {
                expect(value).to.eq('blue');
            });
              
              
        });
    });

    /* The $ele.css() */
    describe.only('$ele.css()', () => {
        before(() => {
            cy.visit('https://www.automationexercise.com/', { timeout: 60000 });
        });

        it('check css background color', () => {
            cy.get('a:contains(" Home")', { timeout: 60000 }).should('be.visible').invoke('css', 'color').should('equal', 'rgb(255, 165, 0)')
            cy.get('a:contains(" Home")', { timeout: 60000 }).should('be.visible').then(($ele) => {
                expect( $ele.css('color')).to.eq('rgb(255, 165, 0)');
            });
        }) 
        });
        });
        

