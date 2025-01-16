/* Internally, cy.get() uses jQuery engine. 

When your selector contains characters that are used in CSS, 
you need to add \\ in front of that character. In your case, it should be cy.get('nickname\\.\\.\\.1234')

NOTES:

*/

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

    it.only("getting element that contains CSS like elements like '.' and ':' ", () => {
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
});