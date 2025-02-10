/* What is shadow DOM

Shadow DOM is a web standard that allows developers to encapsulate HTML, CSS, and JavaScript 
within a component, preventing styles and scripts from leaking in or out. It is widely used 
in Web Components to create reusable, self-contained UI elements.

Key features of Shadow DOM:

Encapsulation: Styles and scripts inside the shadow DOM do not affect the main document, and vice versa.
Scoped styles: CSS inside a shadow tree applies only to elements within it.
Custom components: Enables the creation of reusable UI components.

Just like shadow DOM enables encapsulation of components within a document, 
iframe enables complete isolation of a webpage within another webpage.

Security: Iframes provide sandboxing, allowing secure embedding of external content.
Cross-origin Content: They enable embedding third-party content like advertisements, 
payment gateways, or social media widgets.
Independence: The embedded page operates independently with its own JavaScript execution, 
styles, and DOM.

                                            USE CASE:
     Shadow DOM: Used in Web Components to create reusable UI elements.
     IFRAMES: Used to embed third-party content like ads, videos, or external pages.

Known Issue
When working with cy.click(), it sometimes won't click the right element in Chrome. It's happening because of the ambiguity in spec.

In this case, pass { position: 'top' } to cy.click() like below:

cy.get('#element')
  .shadow()
  .find('[data-test-id="my-button"]')
  .click({ position: 'top' })

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('SHADOW DOM WORKFLOWS', () => {
   
    // below site has shadow DOM inside an iframe
    it('USING shadow()', () => {
        cy.visit('https://practice.expandtesting.com/shadowdom', {timeout: uiTimeout});

        cy.get('#shadow-host', {timeout: uiTimeout})
        .should('be.visible')
        .shadow()
        .find('#my-btn')
        .should('be.visible')
        .click()

    });

    it('By changing config option globally {includeShadowDom: true}', () => {
        cy.visit('https://practice.expandtesting.com/shadowdom', {timeout: uiTimeout});

        cy.get('#shadow-host', {timeout: uiTimeout})
        .should('be.visible')
        // .shadow()
        .find('#my-btn')
        .should('be.visible')
        .click()

    });

    // Be careful while using this way, cypress may not fully navigate the shadow dom, 
    // use shadow(), or global config instead
    
    it.only('By changing config option locally in the it cy.get() {includeShadowDom: true}', () => {
        cy.visit('https://practice.expandtesting.com/shadowdom', {timeout: uiTimeout});

        cy.get('#shadow-host', { includeShadowDom: true })
        .should('be.visible')
        .find('#my-btn', { includeShadowDom: true })
        .should('be.visible')
        .click()

    });
    
});