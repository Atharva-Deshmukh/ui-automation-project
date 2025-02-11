/* returns the underlying OS name, as returned from Node's os.platform().

Even though Cypress runs in the browser, it automatically makes this 
property available for use in your tests.. */

describe('Workflow', () => {
   
    it('check the OS of the system', () => {
        expect(Cypress.platform).to.eq('win32');  
    });
});