import { uiTimeout } from "../../../fixtures/commonData";
import data from "../../../fixtures/stubbedRequest.json";

/*
MOCKING THE RESPONSE

cy.intercept('GET', '/users/**', { fixture: 'users' })

Intercepts HTTP Requests: It listens for any GET request made to any endpoint 
matching the pattern /users/**. The ** wildcard means it can match any subpath, 
e.g., /users/123, /users/profile, etc.

Mocks the Response: Instead of making an actual network request to the server, 
Cypress will respond with the contents of the users.json fixture file 
(located in the cypress/fixtures directory).
*/

describe('MOCKING WORKFLOWS', () => {   

    before(() => {
        cy.intercept('GET', 'https://rahulshettyacademy.com/documents-request', { fixture: 'stubbedRequest' })
        .as('getImage');
    });

    it('Intercept a request and mock the response', () => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});

        cy.get('a:contains("Free Access to InterviewQues/ResumeAssistance/Material")', {timeout: uiTimeout})
        .should('be.visible')
        .click();

        // Wait for the request and verify response
        cy.wait('@getImage', {timeout: 4000}).then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body).to.deep.equal(data);
        });
    })
});