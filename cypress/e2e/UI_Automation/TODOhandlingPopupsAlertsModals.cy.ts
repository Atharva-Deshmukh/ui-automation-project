import { uiTimeout } from "../../fixtures/commonData";

// TODO: https://www.youtube.com/watch?v=C2DjGl5a_-Y

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

it.only('Normal Alert Handling', () => {
    cy.visit('https://the-internet.herokuapp.com/javascript_alerts', {timeout: uiTimeout});

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

   
   cy.get('button:contains("Click for JS Alert")', {timeout: uiTimeout})
   .should('be.visible')
   .click();
   
   Cypress.on('window:alert', (alertText) => {
       expect(alertText).to.equal("I am a JS Alert"); 
   });
});

it('Another way to handle Alert, stubbing', () => {
    cy.visit('https://demo.automationtesting.in/Alerts.html', {timeout: uiTimeout});

    // Create a Cypress stub to track window:alert calls
    const alertStub = cy.stub();
    Cypress.on('window:alert', alertStub);

    cy.get('.btn.btn-danger')
      .should('be.visible')
      .click()
      .then(() => {
        cy.wrap(alertStub).should('have.been.calledWith', "I am an alert box!");
      });
});

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

it('Confirmation Alert', () => {
    cy.visit('https://the-internet.herokuapp.com/javascript_alerts', {timeout: uiTimeout});

    cy.get('button:contains("Click for JS Confirm")', {timeout: uiTimeout})
    .should('be.visible')
    .click().then(() => {
        // By default, cypress automatically closes confirm alert by clicking on OK button
        cy.on('window:confirm', (alertText) => {
            expect(alertText).to.equal("I am a JS Confirm"); 
        })

        cy.get('#result', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.text', 'You clicked: Ok');
    });
    
    
    cy.then(() => {
        // Closing via cancel button, click button again to prompt alert
        cy.get('button:contains("Click for JS Confirm")', {timeout: uiTimeout})
        .should('be.visible')
        .click();

        // First handle the confirm alert and validate on it
        cy.on('window:confirm', (alertText) => {
            expect(alertText).to.equal("I am a JS Confirm"); 
        });

        // closing of alert is done internally by cypress only, we are just instructing it to close
        // using cancel button this time
        cy.on('window:confirm', () => false); 

        cy.get('#result', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.text', 'You clicked: Cancel');
    });
});

/*
Logs me: (stub-1)prompt("I am a JS prompt")

prompt has an input text too that needs to be passed, along with cancel and ok button
It is too, handled by cypress internally by closing ok button by default
we need to have separate event to write the prompt input

CONCEPT NEEDED TO KNOW:
cy.stub()

Syntax
cy.stub()
cy.stub(object, method)

cy.stub(user, 'addFriend')
cy.stub(user, 'addFriend').as('addFriend')

Arguments:
 object (Object): The object that has the method to be replaced.
 method (String): The name of the method on the object to be wrapped.


 WE WILL STUB the prompt event before triggerring it
*/
it('Handling Prompt', () => {
    cy.visit('https://the-internet.herokuapp.com/javascript_alerts', {timeout: uiTimeout});

    let promptStub;

    cy.window().then((win) => {
        // this catches the prompt window, and then inputs the below string
        promptStub = cy.stub(win, 'prompt').returns('PROMPT INPUT STRING');
    });

    // now trigger prompt event
    cy.get('button:contains("Click for JS Prompt")', {timeout: uiTimeout})
    .should('be.visible')
    .click().then(() => {
        // prompt is closed internally by cypress by clicking on OK button
        cy.get('#result', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.text', 'You entered: PROMPT INPUT STRING');

        /*cypress does not allow re-stubbing a function that has already been wrapped.

        You need to restore the stub before creating a new one for handling the cancel action. 
        Use cy.stub().restore() before re-stubbing. 
        Restore stub before re-stubbing */
         promptStub.restore();
    });

    // CLOSING USING CANCEL BUTTON, repeating a same with extra event handling for cancel button
    cy.then(() => {

            // now trigger prompt event again
            cy.get('button:contains("Click for JS Prompt")', {timeout: uiTimeout})
            .should('be.visible')
            .click().then(() => {
                cy.on('window:prompt', () => false); // instructing to close using cancel button

                cy.then(() => {
                    cy.get('#result', {timeout: uiTimeout})
                    .should('be.visible')
                    .and('have.text', 'You entered: null');
                });
            });
    });
});

it('HANDLING AUTHENTICATION POPUP', () => {

    /* Here, we have two inputs to be passed in a prompt, username and password
    we then have sign in button (OK button internally, closed by default by cypress)
    and cancel button. 
    
    We will use auth object in visit()
    */

    cy.visit('https://the-internet.herokuapp.com/basic_auth', {auth: 
    {
        username: 'admin',
        password: 'admin' 
    } 
    });

    cy.contains('Congratulations! You must have the proper credentials.', {timeout: uiTimeout})
    .should('be.visible');
});

// MODAL:
/*
Sometimes, some add like modal popup takes over suddenly and we need to close it since everyting in the DOM
is covered by it.

Cypress get() and find() works in an iframe but this popup is out of that iframe, it needs to be handled
separately

Concept:
window.top returns the topmost window in the hierarchy of window objects.

Workaround:
Close that modal popup
cy.wrap(window.top.document.querySelector('its locator')).click({force: true})
*/
