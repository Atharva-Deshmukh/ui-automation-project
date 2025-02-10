/*
Cypress.Keyboard
The Keyboard API allows you set the default values for how the .type() command is executed.


| Option         | Default | Description                                                                 |
|----------------|---------|-----------------------------------------------------------------------------|
| keystrokeDelay | 10      | The delay, in milliseconds, between keystrokes while typing with .type().   |
                             Set to 0 to remove the delay. Must be a non-negative number.                |



                             Where to put Keyboard configuration

Way-1
Set the keystroke delay in test configuration
The keystroke delay can also be set via test configuration, which can be useful when 
setting it for a single test or a subset of tests.

Way-2
A great place to put this configuration is in the supportFile, since it is loaded 
before any test files are evaluated. */

import { uiTimeout } from "../../fixtures/commonData";

describe('Keyboard API workflows', () => {

    it('Way-1: Place in test configuration, i.e in it block or describe block configuration', {keystrokeDelay: 1000}, () => {
       cy.visit('https://practice-automation.com/form-fields/', {timeout: uiTimeout});

       cy.get('#name-input', {timeout: uiTimeout})
       .should('be.visible')
       .type('USER NAME');

       cy.get('label input[type="password"]', {timeout: uiTimeout})
       .should('be.visible')
       .type('PASSWORD');
    });

    it.only('Way-2: Place in the support file', () => {

        /* To include code before your test files, set the supportFile path. 
        By default, supportFile is set to look for one of the following files:

        Component:

        cypress/support/component.js
        cypress/support/component.jsx
        cypress/support/component.ts
        cypress/support/component.tsx

        E2E:

        cypress/support/e2e.js
        cypress/support/e2e.jsx
        cypress/support/e2e.ts
        cypress/support/e2e.tsx

        Add this in e2e.ts

        Cypress.Keyboard.defaults({
            keystrokeDelay: 1000,
        });
        
        */

       cy.visit('https://practice-automation.com/form-fields/', {timeout: uiTimeout});

       cy.get('#name-input', {timeout: uiTimeout})
       .should('be.visible')
       .type('USER NAME');

       cy.get('label input[type="password"]', {timeout: uiTimeout})
       .should('be.visible')
       .type('PASSWORD');
    });
});