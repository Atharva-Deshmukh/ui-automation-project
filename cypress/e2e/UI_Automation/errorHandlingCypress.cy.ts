/*  
                            Why Is Exception Handling Important?
                            --------------------------------------
    It allows a program to recover from errors and continue running instead of crashing. 

                                Errors vs Exceptions
                                ---------------------

Exceptions are expected failures, which we should recover from.
Errors are unexpected failures arising due to coding errors. 
they are difficult to anticipate.

JavaScript, Python, and other languages treat errors and exceptions as synonyms. 
So we throw Errors when we really mean to throw exceptions.

PHP and Java seem to have this difference baked into the language.


        Handling Cypress Uncaught Exception Due to Unexpected Status Codes
        ------------------------------------------------------------------

By default, Cypress throws an exception if the server responds with a status code other than 200 or 303. 
This helps ensure that tests fail when the application returns error status codes, 
such as 400 (Bad Request) or 500 (Internal Server Error).

However, in some test scenarios, you may expect a status code other than 200 or 303, 

To handle this, use:
                    failOnStatusCode: false
in UI tests:
    cy.visit("https://ecommerce", {
      failOnStatusCode: false
    });

in API tests:
cy.request({
     url:"https://ecommerce",
     failOnStatusCode: false, 
})  */

/* Handling Cypress Uncaught Exception Due to Test Failures
In Cypress UI testing , if a command fails, the test fails. 
To prevent a test case from failing this, you can register a listener 
and ignore the error for the failing test. */

it('Failing test', () => {

    /* To handle globally, add this in support/e2e.ts file inside Cypress.on() */
    cy.on('fail', (err, runnable) => {
        console.warn('Error -> ', err.message);
        return false;
    });

    cy.visit('https://grafana.com/docs/k6/latest/get-started/resources/', {timeout: 30000})
    .then(() => {
        cy.get('something-not-existing', {timeout: 2000}).should('be.visible');
        cy.log('next line')  /* We never reach here, but the test never fails now, test still passes */
    });
});

/* We reach here anyways */
it('Next test', () => {cy.log('I am next');});

it('Handling Exception from Webpage Under Test in Cypress', () => {

    /* To handle globally, add this in support/e2e.ts file inside Cypress.on() */
    cy.on('uncaught:exception', (err, runnable) => {
        
        console.log('Error -> ', err.message);
        console.log('runnable -> ', runnable);
        /* runnable: Represents the test that failed and contains properties like title, fullTitle, 
        and parent, which describe the test. */
        return false;
    });

  cy.visit('https://www.cii.in'); // Use any valid page

  cy.window().then((win) => {
    // Use setTimeout to simulate an async uncaught exception
    // without it, code breaks
    setTimeout(() => {
      win.eval('thisFunctionDoesNotExist()'); // Will throw an error
    }, 0);
  });
});

it.only('Handling Exceptions within the Code in Cypress', () => {
    /* with the error message “The following error originated from your application code, 
    not from Cypress.”  */

    cy.on('uncaught:exception', (err, runnable) => {
        return false;
    });

  cy.visit('https://www.cii.in'); // Use any valid page

  cy.window().then((win) => {
    // This triggers a real JavaScript error inside the app
    setTimeout(() => {
        win.eval('nonExistentFunction()');
    }, 0);
  });
});

it.only('Validate Specific Exceptions', () => {
    cy.on('uncaught:exception', (err, runnable) => {
        
        if(err.message.includes('Unexpected token')){
            return false;
        }
        else return true;
    });
});
