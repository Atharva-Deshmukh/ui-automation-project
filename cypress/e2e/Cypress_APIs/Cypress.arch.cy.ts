/* returns you the CPU architecture name of the underlying OS, as returned 
from Node's os.arch().

Even though Cypress runs in the browser, it automatically makes this 
property available for use in your tests. */

  describe('Workflow', () => {

    it('Get current browser data', () => {
        expect(Cypress.arch).to.deep.equal('x64');  
        // cy.log('ARCHITECTURE -> ', Cypress.arch) ;  // x64
    });
});