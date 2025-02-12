/* A number representing the current test retry count.
Note that Cypress.currentRetry may only be used inside tests and test hooks, 
and will be null outside of tests and test hooks. */

  describe('Workflow', () => {

    it('Get current test retry number', () => {
        expect(Cypress.currentRetry).to.eq(0);  
    });
});