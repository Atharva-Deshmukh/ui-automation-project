import { uiTimeout } from "../../fixtures/commonData";

describe('Various CYPRESS DOM APIs', () => {

    /* Cypress.dom.method() is a collection of DOM related helper methods.
    There are actually dozens of methods attached to Cypress.dom that are not documented below. 
    These methods are used internally by Cypress in nearly every single built in command. */

    before(() => {
        cy.visit('http://127.0.0.1:5500/DOMs/DOM_Cypress_dom.html', {timeout: uiTimeout});
    });

    /*Returns a boolean indicating whether an element is visible.*/
    it('Cypress.dom.isVisible($el)', () => {
        cy.get('.scrollable', {timeout: uiTimeout}).then(($ele) => {
            expect(Cypress.dom.isVisible($ele)).to.be.true;
        });

        cy.get('.hidden', {timeout: uiTimeout}).then(($ele) => {
            expect(Cypress.dom.isVisible($ele)).to.be.false;
        });
    });

    /* Is hidden
    Returns a boolean indicating whether an element is hidden.
    Cypress internally uses this method everywhere to figure out whether an element 
    is hidden, mostly for actionability.*/
    it('Cypress.dom.isHidden($el)', () => {
        cy.get('.hidden', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isHidden($ele)}`); // true
            cy.wrap($ele).should('exist').and('not.be.visible');
        });

        cy.get('.invisible', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isHidden($ele)}`); // true
            cy.wrap($ele).should('exist').and('not.be.visible');
        });
    });

    /* Returns a boolean indicating whether an element is attached to the DOM.*/
    it('Cypress.dom.isAttached($el) and isDetached', () => {
        // Append the detached element to the DOM first
        cy.document().then((doc) => {
            let detachedElement = doc.createElement("div");
            detachedElement.innerText = "I am a detached element.";
            doc.body.appendChild(detachedElement); // Now it's attached
        });

        // Now Cypress can find and check if it's attached
        cy.contains('I am a detached element.').then(($ele) => {
            cy.log(`${Cypress.dom.isAttached($ele)}`); // true
            cy.log(`${Cypress.dom.isDetached($ele)}`); // false
        });
    });

    /* Returns a boolean indicating whether an element is a descendent of another element.*/
    it('Cypress.dom.isDescendent($el)', () => {
        cy.get('div#child', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isDescendent(Cypress.$('#grandparent'), $ele)}`); // true
            cy.log(`${Cypress.dom.isDescendent(Cypress.$('#parent'), $ele)}`); // true
            cy.log(`${Cypress.dom.isDescendent(Cypress.$('#child'), $ele)}`);  // GIVES TRUE
            cy.log(`${Cypress.dom.isDescendent(Cypress.$('#uncle'), $ele)}`);  // false
        });
    });

    /* Returns a boolean indicating whether a node is of document type.*/
    it('Cypress.dom.isDocument($el)', () => {

        cy.document().then((doc) => {                 // <html>...</html>
            console.warn('DOC -> ', doc);
            cy.log(`${Cypress.dom.isDocument(doc)}`); // true
            cy.log(`${Cypress.dom.isDocument(Cypress.$('#grandparent'))}`); // false
        });
    });

    /*Returns a boolean indicating whether an object is a DOM object. 
    Returns false for plain objects, arrays, and other non-DOM elements.*/
    it('Cypress.dom.isDom($el)', () => {
        cy.get('div#child', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isDom($ele)}`); // true
            let obj = { key: 'value' };
            cy.log(`${Cypress.dom.isDom(obj)}`); // false
        });
    });

    /*Returns a boolean indicating whether an object is a DOM element.*/
    it('Cypress.dom.isElement($el)', () => {
        cy.get('div#child', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isElement($ele)}`); // true
            let obj = { key: 'value' };
            cy.log(`${Cypress.dom.isElement(obj)}`); // false
        });

        // we can also check if the element is there or has been deleting
        // Creating and appending the newly created element first
        cy.document()
        .then((doc) => {
            let newElement = doc.createElement('div');
            newElement.innerText = 'NewlyCreatedElement';
            newElement.id = 'newEleId';

            doc.body.appendChild(newElement);
        });

        // Cypress runs commands asynchronously, so Cypress.$('#newEleId') might execute 
        // before the element is appended. Ensure the element is present in the DOM before checking
        cy.get('#newEleId', {timeout: uiTimeout}).then(($ele) => {
            expect(Cypress.dom.isElement($ele)).to.be.true;
        });

        // now, remove this element and check for its presence
        cy.get('#newEleId', {timeout: uiTimeout}).invoke('remove');  
    });

    /*Returns a boolean indicating whether an element can receive focus.
     Cypress internally uses this method everywhere to figure out whether an element 
     is hidden, mostly for actionability.
     
     An element is focusable if:
    It is an <input>, <textarea>, <button>, <select>, <a href>, or any element with tabindex="0".
    It is not disabled (disabled attribute is absent).
    It is visible (display: none; or visibility: hidden; makes it unfocusable).  */
    it('Cypress.dom.isFocusable($el)', () => {
        cy.get('.hidden', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isFocusable($ele)}`); // false since it is hidden
        });
        cy.get('.invisible', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isFocusable($ele)}`); // false since it is hidden
        });

        cy.get('div#child', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isFocusable($ele)}`); // false since div is not the focusable element
        });

        cy.get('.btn', {timeout: uiTimeout}).then(($ele) => {
            cy.log(`${Cypress.dom.isFocusable($ele)}`); //true since button is focusable element
        });
    });

    /*Returns a boolean indicating whether an element currently has focus.
    and Cypress.dom.isFocused() expects a raw DOM element ($focusedEle[0]).
    */
    it('Cypress.dom.isFocused($el)', () => {
        cy.get('.btn', {timeout: uiTimeout}).then(($ele) => {
            expect(Cypress.dom.isFocused($ele[0])).to.be.false;
        });

        // .focus() is called to programmatically focus on the button.
        cy.get('.btn', { timeout: uiTimeout }).focus().then(($ele) => {
            expect(Cypress.dom.isFocused($ele[0])).to.be.true; 
        });
    });

    /*Returns a boolean indicating whether an object is a jQuery object.*/
    it('Cypress.dom.isJquery($el)', () => {
        cy.get('.btn', {timeout: uiTimeout}).then(($ele) => {
            expect(Cypress.dom.isJquery($ele)).to.be.true;
        });
    });

    /*Returns a boolean indicating whether an element is scrollable.
     Cypress internally uses this method everywhere to figure out whether an element 
     can be scrolled, mostly for actionability.*/
    it('Cypress.dom.isScrollable($el)', () => {
        cy.get('.scrollable', {timeout: uiTimeout}).then(($ele) => {
            expect(Cypress.dom.isScrollable($ele)).to.be.true;
        });
    });

    /*Returns a boolean indicating whether an object is a window object.*/
    it('Cypress.dom.isWindow($el)', () => {
        cy.document().then((doc) => {
            expect(Cypress.dom.isWindow(doc)).to.be.false;
        });

        cy.window().then((win) => {
            expect(Cypress.dom.isWindow(win)).to.be.true;
        });
    });    
});