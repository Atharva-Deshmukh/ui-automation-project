import { uiTimeout } from "../../fixtures/commonData";

/* We will learn about :empty jquery seudo-class

and :not(..)
ex: :not(:empty)

// to select all elements we can use cy.get('*')


*/

describe('Empty and non-empty elements', () => {

    before(() => {
        cy.visit('http://127.0.0.1:5500/DOMs/EmptyNonEmpty.html', {timeout: uiTimeout});
    })

    it.skip('Find all empty elements', () => {
        cy.get('body :empty', {timeout: uiTimeout})
        .should('be.visible')
        // .then(($ele) => {
        //     console.warn('ELE -> ', $ele)
        // })
        .and('have.length', 5);  // inlcuding BR tag
    });

    it('Find all non-empty elements', () => {
        cy.get('body>:not(:empty)', {timeout: uiTimeout})
        .not('script') // Exclude script elements injected automatically by cypress
        .should('be.visible')
        .then(($ele) => {
            console.warn('ELE -> ', $ele)
        })
        .and('have.length', 3); 
    });

});