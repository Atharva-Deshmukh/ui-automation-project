/* 
- Cypress.Commands.add() - use to add a custom command to use when writing tests
- Cypress.Command.overwrite() - use to override an existing built-in Cypress command 
  or reserved internal function. 
  Caution: this overrides it for Cypress as well and could impact how Cypress behaves. 

  define command in separate command file
  import the url of that file in cypress/support/commands.ts
  add the command in namespace interface
  
  
                                                    Syntax
                                                    --------

Cypress.Commands.add(name, callbackFn)
Cypress.Commands.add(name, options, callbackFn)

Cypress.Commands.addAll(callbackObj)
Cypress.Commands.addAll(options, callbackObj)   // NOT USED ANYWHERE, so not covered,it is better to use add()
                                                // since we have better control of its type and inputs

Cypress.Commands.overwrite(name, callbackFn)

                                                Correct Usage
                                                ---------------
    Cypress.Commands.add('login', (email, pw) => {})

    Cypress.Commands.addAll({
    login(email, pw) {},
    visit(orig, url, options) {},
    })

    Cypress.Commands.overwrite('visit', (orig, url, options) => {})

    options is only supported for use in Cypress.Commands.add() and not supported 
    for use in Cypress.Commands.overwrite()

    Register these commands in cypress/support/commands.js

                                                OPTIONS
                                            ---------------

The prevSubject (CAN BE BOOLEAN, ARRAY OR STRING) accepts the following values:
    false: ignore any previous subjects: (parent command) DEFAULT
    true: receives the previous subject: (child command)
    optional: may start a chain, or use an existing chain: (dual command)

In addition to controlling the command's implicit behavior you can also add declarative 
subject validations such as:
    element: requires the previous subject be a DOM element
    document: requires the previous subject be the document
    window: requires the previous subject be the window   */

import { uiTimeout } from "../../../fixtures/commonData";

describe('Custom command workflow', () => {
    before(() => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
    });

    describe('Parent commands workflows', () => {
    /* Parent commands always begin a new chain of commands.

    Ex:
        cy.visit()
        cy.request() */

        it('Normal parent command', () => {
            cy.getByName('radioButton').should('be.visible');
        });

        /* Some more parent custom command
        Cypress.Commands.add('logout', () => {
            cy.contains('Login').should('not.exist')
            cy.get('.avatar').click()
            cy.contains('Logout').click()
            cy.get('h1').contains('Login')
            cy.getCookie('auth_key').should('not.exist')
        }) */
    });

    describe('Child commands workflows', () => {
    /* Child commands are always chained off of a parent command, or another child command.
       IMPORTANT: The previous subject will automatically be yielded to the callback function.
        in the cypress namespace, don't pass argument to this function signature

        Ex:
        .click()
        .submit()
        .trigger() */

        it('Normal child command (for element)', () => {
            cy.getByName('radioButton').should('be.visible').Console()
        });

        it('Child command for document', () => {
            cy.document().Console();
        });

        it('Child command for window - get language of current browser', () => {
            cy.window().Console();
        });
    });

    describe('Dual commands workflows', () => {
        /* A dual command can either start a chain of commands or be chained off of an existing one. 
           It works with either a subject or without one
           It is basically the hybrid between both a parent and a child command. You will likely rarely 
           use this, and only a handful of our internal commands use this.

        Ex:
            cy.screenshot()
            cy.scrollTo()
            cy.wait() */
    
            it('Dual command', () => {
                cy.hybridConsole();
                cy.document().hybridConsole();
            });
    });


    describe('OVERRIDING existing Commands', () => {
        /* Cypress.Commands.overwrite can only overwrite commands, not queries. 
           If you want to modify the behavior of a query, you'll need to use Cypress.Commands.overwriteQuery 
           instead. */
    
            it('Override type() to hide password', () => {
                cy.getByName('radioButton').first().type('INSENSITIVE');
                cy.getByName('radioButton').first().type('PASSWORD', {sensitive: true});
            });
    });
});