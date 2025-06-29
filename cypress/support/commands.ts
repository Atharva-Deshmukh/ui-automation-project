/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import 'cypress-wait-until';
import '@4tw/cypress-drag-drop';
import 'cypress-iframe';
import '../support/customQueries';
import '../support/customCommands';
import '../support/tableCustomCommands';
require('cypress-downloadfile/lib/downloadFileCommand');

declare global {
  namespace Cypress {
    interface Chainable {
        // Adding my query here
        getById(id: string): Chainable<JQuery<HTMLElement>>;

        // adding my new custom commands
        getByName(name: string): Chainable<JQuery<HTMLElement>>;
        Console(): void;
        hybridConsole(): void;
        languageWiseStrings(languageEndpoint: string): Chainable<string>;

        /* table custom commands
        Cypress commands (cy.getTableColumnIndex) return a chainable object (Chainable), 
        not a primitive value like a string

        better use a function
        */
        getTableColumnIndex(columnName: string): Chainable<any>;
        
        // Add this for cypress-downloadfile
        downloadFile(
            url: string,
            directory: string,
            fileName: string,
            options?: Partial<{ headers: Record<string, string> }>
        ): Chainable<void>;
    }
  }
}





  