/*  Cypress.log(): This is the internal API for controlling what gets printed to the Command Log.

                                        cy.log() vs Cypress.log()

Feature                 cy.log()                       Cypress.log()
Type of Command         Cypress command (queued)       Low-level logging utility
Asynchronous            Yes                            No
Customization Options   Limited                        Extensive
Typical Use Case        Simple debug messages          Advanced custom logs

Options that can be passed:

Option            Default            Description
----------------------------------------------------------------------
$el               undefined          
name              name of the command
displayName       name of the command    Overrides name only for display purposes.
message           command args          
consoleProps      function() {}         


*/

describe('Cypress.log()', () => {   
    it('Cypress.log()', () => {
        Cypress.log({
            name: 'setSessionStorage',
            // shorter name for the Command Log
            displayName: 'setSS',
            message: `message`,
            consoleProps: () => {
              // return an object which will
              // print to dev tools console on click
              return {
                Key: 'Key',
                Value: 'Val',
                'Session Storage': window.sessionStorage,
              }
            },
          });

          // prints only message
        Cypress.log({
            message: `NEW MESSAGE`
          });
        })
    });