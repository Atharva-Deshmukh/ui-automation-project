/* Situation:

Sometimes, on clicks or any actions performed, there is a loading popup for some milliseconds only
which is generally a progress bar,

It is very difficult to get locator for it unless u have the source code for it.

                        Trick in cypress:
                        ----------------
- delay this request, make it slow 
- whenever we trigger that quick progress bar like event, there is always some XHR request 
  being hit and being executed in the background, so intercept it and delay it/throttle it
- To delay it, we use cypress promise as cypress waits automatically for its resolution


To get the locator of that loader/spinner
in inspect >> sources >> add snipper >> debugger;
reload the page and run this snippet immediately after the page loads
*/

describe('WORKFLOW', () => {
  it('Workflow', () => {
    const xhrReq = /getconfig\/sodar/;


    cy.visit('https://practice-automation.com/spinners/', { timeout: 10000 }).then(() => {

      cy.intercept(xhrReq, (interceptedReq) => {
        console.warn('Response -> ', interceptedReq);
        return Cypress.Promise.delay(15000).then(() => interceptedReq.continue())
      }).as('spinnerXhr');

      cy.get('.spinner', { timeout: 20000 }).should('be.visible');
    });
  });

});