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

*/

it('Workflow', () => {
    let xhrReq = 'https://someURL/1';

    // capture, delay request by 5 seconds or so and get the locator from cypress runner
    cy.intercept(xhrReq, (interceptedReq) => {
        return Cypress.Promise.delay(5000).then(() => {interceptedReq.continue();})
    });

    // Assertions for loader here
});