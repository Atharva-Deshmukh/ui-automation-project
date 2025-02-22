/* Load a fixed set of data located in a file.

cy.fixture('users').as('usersJson') // load data from users.json
cy.fixture('logo.png').then((logo) => {
  // load data from logo.png
})

A path to a file within the fixturesFolder , which defaults to cypress/fixtures.
You can nest fixtures within folders and reference them by defining the path from the fixturesFolder:
cy.fixture('users/admin.json') // Get data from {fixturesFolder}/users/admin.json

When no extension is passed to cy.fixture(), Cypress will search for files with the specified name 
within the fixturesFolder (which defaults to cypress/fixtures) and resolve the first one.
cy.fixture('admin').as('adminJSON')

The example above would resolve in the following order:
cypress/fixtures/admin.json
cypress/fixtures/admin.js
cypress/fixtures/admin.coffee
cypress/fixtures/admin.html
cypress/fixtures/admin.txt
cypress/fixtures/admin.csv

Image fixtures are sent as base64 by default
cy.fixture('images/logo.png').then((logo) => {
  // logo will be encoded as base64
  // and should look something like this:
  // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
})


Change encoding of Image fixture, whenever null is passed, its loaded as a buffer regardless of its extension
cy.fixture('images/logo.png', null).then((logo) => {
  // logo will be read as a buffer
  // and should look something like this:
  // Buffer([0, 0, ...])
  expect(Cypress.Buffer.isBuffer(logo)).to.be.true
})

MOCKING THE RESPONSE

cy.intercept('GET', '/users/**', { fixture: 'users' })

Intercepts HTTP Requests: It listens for any GET request made to any endpoint 
matching the pattern /users/**. The ** wildcard means it can match any subpath, 
e.g., /users/123, /users/profile, etc.

Mocks the Response: Instead of making an actual network request to the server, 
Cypress will respond with the contents of the users.json fixture file 
(located in the cypress/fixtures directory).


Please keep in mind that fixture files are assumed to be unchanged during the test, and thus Cypress 
loads them just once. Even if you overwrite the fixture file itself, the already loaded fixture data 
remains the same.

If you wish to dynamically change the contents of a file during your tests, consider cy.readFile() instead.

*/

import { uiTimeout } from "../../fixtures/commonData";
import data from "../../fixtures/stubbedRequest.json";

describe('Fixtures Workflow', () => {   

    before(() => {
        cy.intercept('GET', 'https://rahulshettyacademy.com/documents-request', { fixture: 'stubbedRequest' }).as('getImage');
    });

    it('MOCKING REQUEST', () => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});

        cy.get('a:contains("Free Access to InterviewQues/ResumeAssistance/Material")', {timeout: uiTimeout})
        .should('be.visible')
        .click();

        // Wait for the request and verify response
        cy.wait('@getImage', {timeout: 4000}).then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body).to.deep.equal(data);
        });


            /* Another way to use:
            cy.fixture('json file path').then((data) => {
                // use this...
            })

            JSON FILE can also be an array of objects

            [
                {},
                {},
                {}
            ]
                
            
            */
    })
});