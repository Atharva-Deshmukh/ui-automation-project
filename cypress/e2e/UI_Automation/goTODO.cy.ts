// cy.visit('http://localhost:8000/folders').go('back')

import { uiTimeout } from "../../fixtures/commonData";

let URL = "https://demo.automationtesting.in/Index.html";

describe('cy.go', () => {
   
    it('Visit site and go back', () => {
        cy.visit(URL, { timeout: uiTimeout });

        cy.url().should('contain', 'Index.html');
        
        // Use a single get command and chain assertions
        cy.get('#enterimg', { timeout: uiTimeout })
            .should('be.visible')
            .click();

        cy.url().should('contain', 'Register.html');
        
        // Cypress already waits for navigation, so no need for explicit cy.wait()
        cy.go('back');
        
        cy.url().should('contain', 'Index.html');
    });
});
