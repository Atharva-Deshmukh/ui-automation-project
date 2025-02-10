/*
The only way to do conditional testing on the DOM is if you're 100% sure that the 
state has "settled" and there is no possible way for it to change.

That is it! In any other circumstance you will have flaky tests if you try to rely 
on the state of the DOM for conditional testing.

A human also has intuition. If you click a button and see a loading spinner, 
you will assume the state is in flux and will automatically wait for it to finish. 
A robot has no intuition - it will do exactly as it's programmed to do.

-------------------------------------------------------------------------------------------------
REMEMBER: You cannot do conditional testing on the DOM unless you are either:
- Server side rendering with no asynchronous JavaScript.
- Using client side JavaScript that only ever does synchronous rendering.
- It's crucial that you understand how your application works else you will write flaky tests.
-------------------------------------------------------------------------------------------------


The strategies
If you're unable to guarantee that the DOM is stable - there are other ways you can 
do conditional testing or work around the problems inherent with it.

You could:
- Remove the need to ever do conditional testing.
- Force your application to behave deterministically.
- Check other sources of truth (like your server or database).
- Embed data into other places (cookies / local storage) to evaluate.
- Add data to the DOM that you can evaluate to know how to proceed.

                                        Various conditional testing scenarios:
                                        --------------------------------------

1. A/B Campaign (pronounced as "A B campaign")

A/B testing—also called split testing or bucket testing—compares the performance of 
two versions of content to see which one appeals more to visitors/viewers.

Ways to test here:

 -> Use URL query params:
    // tell your back end server which campaign you want sent
    // so you can deterministically know what it is ahead of time
    cy.visit('https://example.cypress.io?campaign=A')
    // tests...

    cy.visit('https://example.cypress.io?campaign=B')
    // tests...

    cy.visit('https://example.cypress.io?campaign=C')
    // tests...

    Now there is not even a need to do conditional testing since you're able to know ahead of 
    time what campaign was sent. Yes, this may require server side updates, 
    but you have to make an untestable app testable if you want to test it!


-> Use the server:
   Alternatively, if your server saves the campaign with a session, 
   you could ask your server to tell you which campaign you are on.

    // this sends us the session cookies
    cy.visit('https://example.cypress.io')

    // assuming this sends us back
    // the campaign information
    cy.request('https://example.cypress.io/me')
    .its('body.campaign')
    .then((campaign) => {
        // runs different cypress test code
        // based on the type of campaign
        return campaigns.test(campaign)
    })

-> Use session cookies:
   Another way to test this is if your server sent the campaign in a session cookie that you could read off.

    cy.visit('https://example.cypress.io')
    cy.getCookie('campaign').then((campaign) => {
    return campaigns.test(campaign)  // test accordingly
    })

-> Embed data in the DOM:
   Another valid strategy would be to embed data directly into the DOM - 
   but do so in a way where this data is always present and query-able. 
   It would have to be present 100% of the time, else this would not work.

    cy.get('html')
    .should('have.attr', 'data-campaign')
    .then((campaign) => {
        return campaigns.test(campaign)
    })



2. Welcome Wizard modal

   In this example, let's imagine you're running a bunch of tests and each time you load 
   your application, it may show a "Welcome Wizard" modal.

   The problem with this is that if the wizard renders asynchronously (as it likely does) you 
   cannot use the DOM to conditionally dismiss it.
   Once again - we will need another reliable way to achieve this without involving the DOM.

Ways to test:

-> Use the URL to control it:
    // dont show the wizard
    cy.visit('https://example.cypress.io?wizard=0')

    // show the wizard
    cy.visit('https://example.cypress.io?wizard=1')

-> Use Cookies to know ahead of time:
   In the case where you cannot control it, you can still conditionally 
   dismiss it if you know whether it is going to be shown.

    cy.visit('https://example.cypress.io')
    cy.getCookie('showWizard').then((val) => {
    if (val) {
        // dismiss the wizard conditionally by enqueuing these
        // three additional commands
        cy.get('#wizard').contains('Close').click()
    }
    })


-> Use your server or database:
    If you store and/or persist whether to show the wizard on the server, then ask it.

    cy.visit('https://example.cypress.io')
    cy.request('https://example.cypress.io/me')
    .its('body.showWizard')
    .then((val) => {
        if (val) {
        // dismiss the wizard conditionally by enqueuing these
        // three additional commands
        cy.get('#wizard').contains('Close').click()
        }
    })

-> Embed data in DOM:
   Another valid strategy would be to embed data directly into the DOM but to do so 
   in a way that the data is always present and query-able. The data would have to 
   be present 100% of the time, otherwise this strategy would not work.

    cy.get('html')
    .should('have.attr', 'data-wizard')
    .then((wizard) => {
        if (wizard) {
        // dismiss the wizard conditionally by enqueuing these
        // three additional commands
        cy.get('#wizard').contains('Close').click()
        }
    })


3. ELEMENT EXISTENCE (ye main hai)

   In this example, let's imagine you're running a bunch of tests and each time you load 
   your application, it may show a "Welcome Wizard" modal.

   The problem with this is that if the wizard renders asynchronously (as it likely does) you 
   cannot use the DOM to conditionally dismiss it.
   Once again - we will need another reliable way to achieve this without involving the DOM.

Ways to test:

->  cy.get('body', {timeout: uiTimeout})
        .should('be.visible')
        .then(($body) => {
            if($body.find('input#displayed-text:visible').length) {
                cy.log('VISIBLE');
            }
            else {
            //
            }


THERE IS also a PLUGIN: cypress-if, but Not preferred in the interviews

4. Dynamic text
   The pattern of doing something conditionally based on whether or not certain text 
   is present is identical to element existence above.

    Conditionally check whether an element has certain text:
    // this only works if there's 100% guarantee body has fully rendered without any pending changes
    // to its state
    cy.get('body').then(($body) => {
        // synchronously ask for the body's text
        // and do something based on whether it includes
        // another string
        if ($body.text().includes('some string')) {
        // yup found it
        cy.get(...).should(...)
        } else {
        // nope not here
        cy.get(...).should(...)
        }
    })

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('Conditional Testing', () => {

    let hideButton = () => cy.get('input#hide-textbox', {timeout: uiTimeout}).should('be.visible');
    let showButton = () => cy.get('input#show-textbox', {timeout: uiTimeout}).should('be.visible');
    let inputTextBox = () => cy.get('input#displayed-text', {timeout: uiTimeout});

    it("Show and hide button and apply conditional testing", () => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});

        cy.get('legend:contains("Element Displayed Example")', {timeout: uiTimeout})
        .should('be.visible');

        // show hide buttons
        hideButton();
        showButton();

        // hideButton().click(); // hide the display box

        // test object based on visibility
        cy.get('body', {timeout: uiTimeout})
        .should('be.visible')
        .then(($body) => {
            if($body.find('input#displayed-text:visible').length) {
                cy.log('VISIBLE');
                inputTextBox().should('exist').and('be.visible');
            }
            else {
            inputTextBox().should('exist').and('not.be.visible');
            cy.log('NOT VISIBLE');
            }
        });
    });
});