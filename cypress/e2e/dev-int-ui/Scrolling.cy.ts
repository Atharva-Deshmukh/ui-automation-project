import { should } from "chai";
import { uiTimeout } from "../../fixtures/commonData";

describe('scrollIntoView()', () => {

    it('Scroll element at the bottom', () => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: 60000});
        cy.get('.gf-t .gf-li a:contains("Latest News")').scrollIntoView().should('be.visible');
    });

    it('Scroll a table above first and then scroll bottommost row of that table to above', () => {
        cy.reload(); 
        cy.get('table#product tr td:contains("Smith")', {timeout: 60000}).scrollIntoView().should('be.visible');
    });

    it('Scroll a horizontal scroll bar to the fullest', () => {
        cy.visit('https://www.w3schools.com/howto/howto_css_menu_horizontal_scroll.asp', {timeout: 60000});
        cy.get('.horscroll', {timeout: 60000}).scrollTo('100%', '0%'); // origin = top left
        cy.get('a:contains("Work")', {timeout: 60000}).should('be.visible');

        /* Do not error if element is not scrollable
           Let's say we do not know whether our table element is scrollable. 
           Sometimes the table may be scrollable (with 2,000 rows) and sometimes the table may not be 
           scrollable (with 5 rows). You can ignore the error checking to ensure the element is scrollable 
           by passing ensureScrollable: false.

            // will move on to next command even if table is not scrollable
            cy.get('table').scrollTo('bottom', { ensureScrollable: false })*/
    });

    /* ScrollTo syntaxes:

        cy.scrollTo(position)
        ---or---
        .scrollTo(position)

        Examples:

        Scroll the window 500px to the right
        cy.scrollTo('500px')

        Scroll to the bottom of the window
        cy.scrollTo('bottom')
    
    */

    it('Scroll full page to bottom', () => {
        cy.visit('https://www.w3schools.com/howto/howto_css_menu_horizontal_scroll.asp', {timeout: 60000});
        cy.scrollTo('bottom') // directly scroll bottom of window
        cy.contains('Forum' , {timeout: 60000}).should('be.visible');

        /* Do not error if element is not scrollable
           Let's say we do not know whether our table element is scrollable. 
           Sometimes the table may be scrollable (with 2,000 rows) and sometimes the table may not be 
           scrollable (with 5 rows). You can ignore the error checking to ensure the element is scrollable 
           by passing ensureScrollable: false.

            // will move on to next command even if table is not scrollable
            cy.get('table').scrollTo('bottom', { ensureScrollable: false })*/
    });

    it.only('CHALLENGE: scroll vertically and horizontally and click the hidden button', () => {
        cy.visit('https://practice.expandtesting.com/scrollbars', {timeout: uiTimeout});
        cy.get('#hidingButton', {timeout: 60000}).scrollIntoView().should('be.visible');
    });

    

});