import { uiTimeout } from "../../fixtures/commonData";

describe('Focus and blur workflow', () => {

/* Focus: Focus on a DOM element.
- It is unsafe to chain further commands that rely on the subject after .focus().
- yields the same subject it was given.
- If there is currently a different DOM element with focus, Cypress issues a blur 
  event to that element before running the .focus() command.
- Ensure the element you are trying to call .focus() on is a focusable element. */

    it('cy.focus()', () => {
       cy.visit('https://practice-automation.com/form-fields/', {timeout: uiTimeout});

       cy.get('#name-input', {timeout: uiTimeout})
       .should('be.visible')
       .focus()
       .should('be.focused')
       .type('USER NAME');

       // non focusable elements like div
       cy.get('.entry-content', {timeout: uiTimeout})
       .should('be.visible')
       .focus()
       .should('be.focused');

       /* Error issued
       cy.focus() can only be called on a valid focusable element. Your subject 
       is a: <div class="entry-content" itemprop="text">...</div> */
    });

    /* Gets the DOM element that is currently focused. 
    - yields the DOM element it found.
    - Its a query, and it is safe to chain further commands.
    - Its without an argument */
    it('cy.focused()', () => {
       cy.visit('https://practice-automation.com/form-fields/', {timeout: uiTimeout});

       cy.get('#name-input', {timeout: uiTimeout})
       .should('be.visible')
       .focus()
       .should('be.focused')
       .then(() => {
        cy.focused().then(($focusedEle) => {

            // wrap will return a chainable wrapper but expect needs a raw element
            // 0th index will have element
            expect($focusedEle[0]).to.have.id('name-input');
        })
       });
    });

    /* Blur a focused element.
       It is unsafe to chain further commands that rely on the subject after .blur().
       This element must currently be in focus. If you want to ensure an element is 
       focused before blurring, try using .focus() before .blur().
    
    */
    it.only('cy.blur()', () => {
       cy.visit('https://practice-automation.com/form-fields/', {timeout: uiTimeout});

       cy.get('#name-input', {timeout: uiTimeout})
       .should('be.visible')
       .focus()
       .blur()
       .should('not.be.focused');
       
       // if the element is not focused, then we can force blur
       cy.get('#name-input', {timeout: uiTimeout})
       .should('be.visible')
       .and('not.be.focused')
       .blur({ force: true })
       .should('not.be.focused');

    });
});
