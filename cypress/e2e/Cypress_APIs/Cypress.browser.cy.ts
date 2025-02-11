/* Cypress.browser returns you properties of the browser.

Sample Object:
 {
     channel: 'stable',
     displayName: 'Chrome',
     family: 'chromium',
     isChosen: true,
     majorVersion: 80,
     name: 'chrome',
     path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
     version: '80.0.3987.87',
     isHeaded: true,
     isHeadless: false
 }


 Uses in Tests:

 // if in Chrome, check css property was properly applied
  if (Cypress.browser.name === 'chrome') {
    cy.get('.header').should('have.css', 'margin-right').and('eq', '0')
  }


// only takes in headless browser
cy.screenshot()

Cypress.Commands.overwrite(
  'screenshot',
  (originalFn, subject, name, options) => {
    // only take screenshots in headless browser
    if (Cypress.browser.isHeadless) {
      // return the original screenshot function
      return originalFn(subject, name, options)
    }

    return cy.log('No screenshot taken when headed')
  }
) */

  describe('Workflow', () => {

    const browserInfo = {
      channel: "stable",
      displayName: "Electron",
      family: "chromium",
      isHeaded: true,
      isHeadless: false,
      majorVersion: 114,
      name: "electron",
      path: "",
      version: "114.0.5735.289"
    };
    
   
    it('Get current browser data', () => {
        expect(Cypress.browser).to.deep.equal(browserInfo);  
    });
});