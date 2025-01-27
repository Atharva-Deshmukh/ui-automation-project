// totalAmount  | table id=product tr td Smith

describe('scrollIntoView()', () => {

    it('Scroll element at the bottom', () => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: 60000});
        cy.get('.gf-t .gf-li a:contains("Latest News")').scrollIntoView().should('be.visible');
    });

    it('Scroll a table above first and then scroll bottommost row of that table to above', () => {
        cy.reload(); 
        cy.get('table#product tr td:contains("Smith")', {timeout: 60000}).scrollIntoView().should('be.visible');
    });

    

});