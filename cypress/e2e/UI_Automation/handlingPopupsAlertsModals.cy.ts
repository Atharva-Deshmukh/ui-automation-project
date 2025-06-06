import { uiTimeout } from "../../fixtures/commonData";

/* CONCEPT NEEDED TO KNOW:

cy.stub()

Syntax
cy.stub()
cy.stub(object, method)

cy.stub(user, 'addFriend')
cy.stub(user, 'addFriend').as('addFriend')

Arguments:
 object (Object): The object that has the method to be replaced. */

describe('Alert', () => {

    /* window.alert(): The alert window is automatically handled and closed by cypress
    which is why we don't see it in cypress runner time travel
    We don't need to write separate code to close an alert in cypress.
    Cypress auto accepts it.
    
    Log will have something like this -> (alert)I am a JS Alert [(alert) <text of alert>] 
    
    But to perform validation on alert window, we need to trigger event
    
    Event                                                    Details
    ------------------------------------------------------------------------
    Name:                                                  window:alert
    
    Yields:                                             the alert text (String)
    
    Description:                            Fires when your app calls the global window.alert() method. 
                                        Cypress will auto accept alerts. You cannot change this behavior. */

    it('Way-1: Using built in event in cypress', () => {
        cy.visit('https://the-internet.herokuapp.com/javascript_alerts', { timeout: uiTimeout });

        /*
    
        This code cannot validate on alert since alert is automatically closed by cypress
        cy.get('button:contains("Click for JS Alert")', {timeout: uiTimeout})
        .should('be.visible')
        .click()
        .then(() => {
            cy.get('#result', {timeout: uiTimeout})
            .should('have.text', 'You successfully clicked an alert');
        }); 
        
        */


        cy.get('button:contains("Click for JS Alert")', { timeout: uiTimeout })
            .should('be.visible')
            .click();

        Cypress.on('window:alert', (alertText) => {
            expect(alertText).to.equal("I am a JS Alert");
        });
    });

    it('Way-2: Stubing the window.alert() method', () => {
        cy.visit('https://demo.automationtesting.in/Alerts.html', { timeout: uiTimeout });

        cy.window().then((winObj) => {
            cy.stub(winObj, 'alert').as('alertStub');
        });

        cy.get('.btn.btn-danger', {timeout: uiTimeout})
            .should('be.visible')
            .click()
            .then(() => {
                cy.get('@alertStub').should('have.been.calledOnceWith', 'I am an alert box!');
            });
    });

    it('Way-3: Handling multiple alert popups one after another', () => {

        /* Workaround: Use stub.getCall(n) => returns nth call

           - Only accepts positive numbers.
           - First call is at index 0.

            Use stub.getCall(0) => returns first call
            Use stub.getCall(1) => returns second call */

        cy.visit('https://qaboxletstestcypresspracticesite.netlify.app/differentalerttypes', { timeout: uiTimeout });

        let storedStub;

        cy.window().then((winObj) => {
            storedStub = cy.stub(winObj, 'alert').as('alertStub'); // cy.stub() returns a Sinon.js stub. 
        });

        cy.get('#miltiplealert', {timeout: uiTimeout})
            .should('be.visible')
            .click()
            .then(() => {
                expect(storedStub.getCall(0)).to.be.calledWithExactly('First Alert Box');
                expect(storedStub.getCall(1)).to.be.calledWithExactly('Second Alert Box');
                expect(storedStub.getCall(2)).to.be.calledWithExactly('Third Alert Box');
            });
    });
});

describe('Confirm handling cypress', () => {

/* window.confirm():

Log will have something like this -> (confirm)I am a JS Confirm

But to perform validation on alert window, we need to trigger event

Event                                                    Details
------------------------------------------------------------------------
Name:                                                  window:confirm

Yields:                                             the confirmation text (String)

Description:                            Fires when your app calls the global window.confirm() method. 
                                        Cypress will auto accept confirmations.
                                        Return false from this event and the confirmation will be canceled.

                                        By default, cypress will close this confirm alert by pressing OK button
                                        if we have to close this using cancel button, we need to handle it
                                        separately
*/

    it('Way-1: Using built in event in cypress', () => {
        cy.visit('https://the-internet.herokuapp.com/javascript_alerts', { timeout: uiTimeout });

        cy.get('button:contains("Click for JS Confirm")', { timeout: uiTimeout })
            .should('be.visible')
            .click()
            .then(() => {
                // By default, cypress automatically closes confirm alert by clicking on OK button
                cy.on('window:confirm', (alertText) => {
                    expect(alertText).to.equal("I am a JS Confirm");
                })

                cy.get('#result', { timeout: uiTimeout })
                    .should('be.visible')
                    .and('have.text', 'You clicked: Ok');
            });


        cy.then(() => {
            // Closing via cancel button, click button again to prompt alert
            cy.get('button:contains("Click for JS Confirm")', { timeout: uiTimeout })
                .should('be.visible')
                .click();

            /* We are first intercepting the confirm event, expecting on the text and then closing this */
            cy.on('window:confirm', (alertText) => {
                expect(alertText).to.equal("I am a JS Confirm");
            });

            /* Closing of alert is done internally by cypress only, we are just instructing it to close
               using cancel button this time */

            cy.on('window:confirm', () => false);

            /* This can also be written as
            
            cy.on('window:confirm', () => {
                return false;
            }); */

            cy.get('#result', { timeout: uiTimeout })
                .should('be.visible')
                .and('have.text', 'You clicked: Cancel');
        });
    });

    it('Way-2: Stubbing the window.confirm() method', () => {
        cy.visit('https://the-internet.herokuapp.com/javascript_alerts', { timeout: uiTimeout });

        // First stub, to test default acceptance of confirm alert by cypress
        cy.window().then((winObj) => {
            cy.stub(winObj, 'confirm').as('confirmStub').returns(true);
        });

        cy.get('button:contains("Click for JS Confirm")', { timeout: uiTimeout })
            .should('be.visible')
            .click()
            .then(() => {

                cy.get('@confirmStub').should('have.been.calledOnceWith', 'I am a JS Confirm');

                cy.get('#result', { timeout: uiTimeout })
                    .should('be.visible')
                    .and('have.text', 'You clicked: Ok');
            });

            /* Cypress automatically restores stubs between tests, not within a single test, 
               To manually restore it, do as below, and then we can stub confirm method again
               and test cancel confirm scenario */

            cy.get('@confirmStub').then((stub: any) => {
                stub.restore();
            });

            cy.window().then((winObj) => {
                cy.stub(winObj, 'confirm').as('confirmStub').returns(false);
            });

            cy.get('button:contains("Click for JS Confirm")', { timeout: uiTimeout })
            .should('be.visible')
            .click()

            cy.get('#result', { timeout: uiTimeout })
                .should('be.visible')
                .and('have.text', 'You clicked: Cancel');
    });
}); 

describe('Prompt handling in cypress', () => {
    /* Logs me: (stub-1)prompt("I am a JS prompt")

    prompt has an input text too that needs to be passed, along with cancel and ok button
    It is too, handled by cypress internally by closing ok button by default
    we need to have separate event to write the prompt input

    method (String): WE WILL STUB the prompt event before triggerring it */

    it('There is no built in cypress event for this, we will need to stub it', () => {
        cy.visit('https://the-internet.herokuapp.com/javascript_alerts', { timeout: uiTimeout });

        let promptStub;

        cy.window().then((win) => {
            // this catches the prompt window, and then inputs the below string
            promptStub = cy.stub(win, 'prompt').returns('AD_PROMPT');
        });

        // now trigger prompt event
        cy.get('button:contains("Click for JS Prompt")', { timeout: uiTimeout })
            .should('be.visible')
            .click().then(() => {
                // prompt is closed internally by cypress by clicking on OK button
                cy.get('#result', { timeout: uiTimeout })
                    .should('be.visible')
                    .and('have.text', 'You entered: AD_PROMPT');

                /*cypress does not allow re-stubbing a function that has already been wrapped.
        
                You need to restore the stub before creating a new one for handling the cancel action. 
                Use cy.stub().restore() before re-stubbing. 
                Restore stub before re-stubbing */
                promptStub.restore();
            });

        // CLOSING USING CANCEL BUTTON, repeating a same with extra event handling for cancel button
        cy.then(() => {

            // now trigger prompt event again
            cy.get('button:contains("Click for JS Prompt")', { timeout: uiTimeout })
                .should('be.visible')
                .click().then(() => {
                    cy.on('window:prompt', () => false); // instructing to close using cancel button

                    cy.then(() => {
                        cy.get('#result', { timeout: uiTimeout })
                            .should('be.visible')
                            .and('have.text', 'You entered: null');
                    });
                });
        });
    });
});

describe('Authentication alert popup', () => {
    it('HANDLING AUTHENTICATION POPUP', () => {

        /* Here, we have two inputs to be passed in a prompt, username and password
        we then have sign in button (OK button internally, closed by default by cypress)
        and cancel button. 
        
        We will use auth object in visit() */
    
        cy.visit('https://the-internet.herokuapp.com/basic_auth', {auth: 
        {
            username: 'admin',
            password: 'admin' 
        } 
        });
    
        cy.contains('Congratulations! You must have the proper credentials.', {timeout: uiTimeout})
        .should('be.visible');
    });
});

// Source: Gleb Bahmutov
describe('Handling modal popup that covers entire page, like an ad', () => {

    /* MODAL that covers entire page, Workaround:
    Sometimes, some add like modal popup takes over suddenly and we need to close it since everyting in the DOM
    is covered by it.

    Cypress itself work in a separate iframe, and this popup is in another iframe, hence get() and find()
    are not able to locate it.

    Concept:
    window.top returns the topmost window in the hierarchy of window objects.

    Workaround:
    To Close that modal popup
    cy.wrap(window.top.document.querySelector('Locator of close button of that popup')).click({force: true}) */

    it('Workflow', () => {
        cy.visit('https://www.bistromd.com/collections/lunch-signature', {timeout: uiTimeout});

        cy.get('[href="#pop-1"] > .img-wrapper', {timeout: uiTimeout})
        .should('be.visible')
        .click();

        cy.wait(8000);

        // add aaygi ab

        cy.pause();
    });
});
