/* Internally, cy.get() uses jQuery engine. 

When your selector contains characters that are used in CSS, 
you need to add \\ in front of that character. In your case, it should be cy.get('nickname\\.\\.\\.1234') */

describe('cy.get() workflows', () => {

    it('getting element that contains something using *', () => {
        cy.visit('https://www.automationexercise.com/').then(() => {
            cy.get('h1 span:contains("Automation")', {timeout: 60000}).should('be.visible');
            

            // get text of URL that contains somehting
            cy.get('.shop-menu a[href*="view"]', {timeout: 60000}).should('be.visible').and('have.text', ' Cart');
        });
    });

    it('getting element that starts with sonething using ^', () => {
        cy.visit('https://www.automationexercise.com/').then(() => {
            cy.get('h1 span:contains("Automation")', {timeout: 60000}).should('be.visible');
            

            // get text of URL that contains somehting
            cy.get('.shop-menu a[href^="/pro"]', {timeout: 60000}).should('be.visible');
        });
    });

    it('getting element that ends with sonething using $', () => {
        cy.visit('https://www.automationexercise.com/').then(() => {
            cy.get('h1 span:contains("Automation")', {timeout: 60000}).should('be.visible');
            

            // get text of URL that contains somehting
            cy.get('.shop-menu a[href$="in"]', {timeout: 60000}).should('be.visible');
        });
    });

    /* DOM USED:

    <body>
        <div id="message-container">
            <p id="message1">Message Container - 1</p>
            <p id="message2">Message Container - 2</p>
        </div>

        <div id="message....container">
            Contains ...
        </div>

        <div id="message::container">
            Contains ::
        </div>
    </body>
    
    */

    it("getting element that contains CSS like elements like '.' and ':' ", () => {
        cy.visit('http://127.0.0.1:5500/DOM.html').then(() => {
            cy.get('#message-container', {timeout: 60000}).should('be.visible');

            // cy.get('#message....container', {timeout: 60000}).should('be.visible'); // Syntax error, unrecognized expression: #message....container
            
            /* getting element that contains '.'
            Internally, cy.get() uses jQuery engine. When your selector contains characters that are used in 
            CSS, you need to add \\ in front of that character. In your case, it should be 
            cy.get('nickname\\.\\.\\.1234')
            */

            cy.get('#message\\.\\.\\.\\.container', {timeout: 60000}).should('be.visible');
            /*assert expected <div#message....container> to be visible*/

            // cy.get('#message::container', {timeout: 60000}).should('be.visible'); //Syntax error, unrecognized expression: #message::container
            cy.get('#message\\:\\:container', {timeout: 60000}).should('be.visible'); 
            /*assert expected <div#message::container> to be visible */
            
        });
    });

    it("getting repeated elements", () => {
        cy.visit('http://127.0.0.1:5500/DOM.html').then(() => {
            cy.get('#message-container', {timeout: 60000}).should('be.visible');

            cy.get('#message-container p', {timeout: 60000}).should('be.visible').then(($ele) => {
                console.log($ele) 
                /* a complex object of cypress's own wrapped jquery is logged

                This object helps cypress to chain commands

                const jqueryObject = {
                    0: 'p#message1',
                    1: 'p#message2',
                    length: 2,
                    prevObject: {
                        0: 'document',
                        length: 1,
                        selector: '',
                        __proto__: Object.prototype
                    },
                    selector: 'p',
                    __proto__: Object.prototype
                    }; */

                    expect($ele).to.have.length(2); // indicates two matches
                    expect($ele.length).to.eq(2); // indicates two matches
            });
        });
    });

    it.only("cy.get() vs cy.find()", () => {
        cy.visit('http://127.0.0.1:5500/DOM.html').then(() => {
            cy.get('#message-container', {timeout: 60000}).should('be.visible');

            /* The cy.get command always starts its search from the cy.root element (<html> of documents object)
            unless used inside the .within() command, where scope starts from within that selector. 
            
            The .find command starts its search from the current subject itself 
            
            DOM used:

            <body>
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

            // get find all divs starting from the root element.
            cy.get('#mess2', {timeout: 60000}).get('div').should('have.length', 6); 
            cy.get('#mess2', {timeout: 60000}).get('div').then(($ele) => {
                console.warn('ELES -> ', $ele);

                /* Jquery object:
                const jqueryObject = {
                    0: 'div#message-container',
                    1: 'div#div-1',
                    2: 'div#div-2.AD',
                    3: 'div#div-3',
                    4: 'div#message....container',
                    5: 'div#message::container',
                    length: 6,
                    prevObject: {
                        0: 'document',
                        length: 1,
                        selector: '',
                        __proto__: Object.prototype
                    },
                    selector: 'div',
                    __proto__: Object.prototype
                    }; */

                    // we can navigate at any level using get()
                    cy.wrap($ele).get('#div-1').should('be.visible');
            });

            // find() will always start from the current element and will stop immediately after found
            cy.get('#div-2', {timeout: 60000}).find('div').should('have.length', 1).and('have.id', 'div-3'); 


        });
    });
});