/* An object representing the currently executing test instance, with properties 
to access the title of the test.

Note that Cypress.currentRetry may only be used inside tests and test hooks, 
and will be null outside of tests and test hooks. */

describe('Workflow', () => {

    let object = {
        title: "Get current test retry number",
        titlePath: ["Workflow", "Get current test retry number"]
      };
      

    it('Get current test retry number', () => {
        // console.warn('OBJ -> ', Cypress.currentTest)
        expect(Cypress.currentTest).to.deep.equal(object);  
    });
});