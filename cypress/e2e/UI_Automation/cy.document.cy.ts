/* Document object
document
 ├── html
 │   ├── head
 │   │   ├── title
 │   │   ├── meta
 │   │   ├── link
 │   │   ├── script
 │   │   └── style
 │   ├── body
 │   │   ├── header
 │   │   ├── main
 │   │   │   ├── section
 │   │   │   │   ├── article
 │   │   │   │   └── aside
 │   │   ├── footer

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('Workflow', () => {
    it('Verifing the text contentType of website', () => {

        // if it simply returns JSON, then its application/json, else returns text/html
        cy.visit('https://docs.cypress.io/api/commands/window', {timeout: uiTimeout}).then(() => {
            cy.document().then((docObj) => {
                expect(docObj.contentType).to.eq('text/html');
            });
        });


        // THIS WON'T WORK since cy.visit() don't work with queryParams
        // cy.visit('https://jsonplaceholder.typicode.com/posts?_limit=3', {timeout: uiTimeout}).then(() => {
        //     cy.document().then((docObj) => {
        //         expect(docObj.contentType).to.eq('application/json');
        //     });
        // });
    });

    it('Verifing document Title', () => {
        cy.visit('https://docs.cypress.io/api/commands/window', {timeout: uiTimeout}).then(() => {
            cy.document().then((docObj) => {
                expect(docObj.title).to.eq('window | Cypress Documentation | Cypress Documentation');
            });
        });
    });

    it('Document width and height using jquery', () => {
        /* The document object itself does not have width and height properties like 
        an element would. Instead, you typically use properties from document.documentElement
         (the <html> tag) or document.body to get dimensions. 
         
         The native document object does not have .width() or .height() methods.
        However, jQuery provides these methods for elements, so converting the document into a jQuery 
        object allows you to call width() and height() directly. */
        cy.visit('https://docs.cypress.io/api/commands/window', {timeout: uiTimeout}).then(() => {
            cy.document().then((docObj) => {
                let docJqry = Cypress.$(docObj);
                cy.log('WIDTH -> ', docJqry.width());       // same as scrollWidth
                cy.log('WIDTH -> ', docJqry.height());      // same as scrollHeight

                cy.log('Width Actual:', docObj.documentElement.clientWidth);
                cy.log('Height Actual:', docObj.documentElement.clientHeight);

                cy.log('Scroll Width:', docObj.body.scrollWidth);
                cy.log('Scroll Height:', docObj.body.scrollHeight);
            });
        });
    });
});