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
import { login, logout } from "./loginHelper";
import 'cypress-wait-until';

declare global {
  namespace Cypress {
    interface Chainable {
        loginTargetSite(targetSite: string, username: string, password: string): void;
        logoutTargetSite(): void;
        countMenus(): void;
        logWithPrefix(options: any): string;
    }
  }
}

/**
 export function loginWithUserGoToSite(username, sitename) {
  cy.log("login with " + username + " and Open site " + sitename)
  cy.session([username, Cypress.env('ECODOMUS_ADMIN_PASSWORD')], () => {
    //login with username
    loginToEcodomus(username)
    //validate Site is present
    goToSites()
    if (sitename != "") {
      siteSearch().clear().type(sitename + '{enter}')
      loadingImgWait().should("not.exist")
      searchResultTable().contains(sitename).click()
    }
  })
}
 */

// parent commands: can directly used with cy...
Cypress.Commands.add('loginTargetSite', (targetSite: string, username: string, password: string) => {
    cy.session({username, password}, () => {
      login(targetSite, username, password);
    });
});

Cypress.Commands.add('logoutTargetSite', () => {
    logout();
});

// child commands: can be used with a parent command 
Cypress.Commands.add('countMenus', { prevSubject: 'element' }, (subject, options) => {
  let menuCount: number =  0;
  cy.wrap(subject).find('ul.oxd-main-menu li a').each(($li) => {
    const classWithinSubject = $li.attr('class');
    // cy.log('classWithinSubject -> ', classWithinSubject);
    const regex = /\b\w*item\w*\b/g;
    if(regex.test(classWithinSubject)) { menuCount++; }
    cy.log('menuCount -> ', menuCount);
  });
});

// dual commands: can be used with or without a parent
// Custom command to log a message with a customizable prefix
// used options here as second parameter
Cypress.Commands.add('logWithPrefix', { prevSubject: 'optional' }, (subject, options) => {
  const prefix = options && options.prefix ? options.prefix : 'Default';
  const suffix = options && options.suffix ? options.suffix : 'Default';
  
  const message = subject?`Subject: ${subject}, Prefix: ${prefix} , Suffix: ${suffix}`: `No subject, Prefix: ${prefix}, Suffix: ${suffix}`;

  cy.log(message);
});




  