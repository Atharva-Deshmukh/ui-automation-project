/* cy.wrap()
 The cy.wrap command is used to wrap a value, such as an object, array, 
 or any other value, into a Cypress chainable object. This allows you to 
 work with that value using Cypress commands.

*/

describe('Wrap workflow', () => {

    let a: number[] = [1, 2, 3, 4];
    let obj: any = {
        a: 'A',
        b: 'B',
        c: 'C',
    };

    it('wrap with arrays', () => {
        cy.wrap(a).then(($arr) => {
            console.warn('ARRAY -> ', $arr); // [1, 2, 3, 4]
            cy.wrap($arr).should('have.length', 4);
        });
    });

    it('wrap with objects', () => {
        cy.wrap(obj).then(($obj) => {
            console.warn('OBJECT -> ', $obj); // {a: 'A', b: 'B', c: 'C'}
            cy.wrap($obj).should('have.any.keys', 'a', 'b', 'c');
        });
    });

    it.only('wrap with DOM elements', () => {
        cy.visit('http://127.0.0.1:5500/DOM.html');
        
        /* Cypress wraps elements into a jQuery-like object for easy chaining and interaction.
        $ele[0] retrieves the raw DOM element from the jQuery object. 
        
        DOM USED:
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DOM Wrap Example</title>
        </head>
        <body>
        <div id="message-container">
            <p id="message1">Message Container - 1</p>
            <p id="message2">Message Container - 2</p>
        </div>
        </body>
        </html>
        */
        cy.get('#message-container', {timeout: 40000}).should('be.visible').then(($ele) => {
            console.warn('DOM -> ', $ele);  // PRINTS a very complex object which has innerHTML, innerText
                                           // outerHTML, outerTEXT
            // to print DOM, use: console.log($ele[0].outerHTML)
        });
    });
});