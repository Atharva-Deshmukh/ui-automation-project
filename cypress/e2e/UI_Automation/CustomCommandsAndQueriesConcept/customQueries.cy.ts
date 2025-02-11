/* METHODS
Cypress.Commands.addQuery(name, callbackFn)
Cypress.Commands.overwriteQuery(name, callbackFn)

Define queries in your cypress/support/commands.js file, 
since it is loaded before any test files are evaluated via an import statement in the supportFile.


STEPS:
- Write the query directly in command.js and make it part of namespace
 OR write it in a separate file and import it in command.ts and then make it part of namespace

QUERIES are
cypress\support\customQueries.ts


declare global {
  namespace Cypress {
    interface Chainable {
        loginTargetSite(targetSite: string, username: string, password: string): void;
        logoutTargetSite(): void;
        countMenus(): void;
        logWithPrefix(options: any): string;

        // Adding my query here
        getById(id: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.overwriteQuery('get', function (originalFn, ...args) {
  console.log('PUTIN'); // Log "PUTIN" every time cy.get() is called
  return originalFn.apply(this, args); // Call the original cy.get() function
});



*/

import { uiTimeout } from "../../../fixtures/commonData";

describe('Custom Queries workflow', () => {

  before(() => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
  });

    it('Creating a new custom query', () => {
        cy.getById('dropdown-class-example').should('be.visible');
    });

    it('Creating a new custom query', () => {
        cy.get('#dropdown-class-example').should('be.visible');
    });

});
