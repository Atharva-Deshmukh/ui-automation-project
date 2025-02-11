/* METHODS
Cypress.Commands.addQuery(name, callbackFn)
Cypress.Commands.overwriteQuery(name, callbackFn)

Define queries in your cypress/support/commands.js file, 
since it is loaded before any test files are evaluated via an import statement in the supportFile.


STEPS:
- Write the query directly in command.js and make it part of namespace
 OR write it in a separate file and import it in command.ts and then make it part of namespace

Cypress.Commands.addQuery('getById', function (id) {
  // Outer function (executes once per command)
  Cypress.log({ name: 'getById', message: id });

  return function (subject) {
    // Inner function (executes multiple times with retry)
    console.log('getById called with:', id);
    return cy.get(`#${id}`);
  };
});

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


*/

import { uiTimeout } from "../../../fixtures/commonData";

describe('Custom Queries workflow', () => {

    it('Creating a new custom query', () => {
      cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
        cy.getById('dropdown-class-example').should('be.visible');
    });

});
