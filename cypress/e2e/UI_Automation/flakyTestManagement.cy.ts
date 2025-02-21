/* Gleb playlist is referred

Way to find reason of flake:
- Compare a successfull test run with the failed one line by line
- U will automatically notice some UI flakiness, or some missed XHR request..

- Situation-1: use {timeout: x0000} for uncertain elements, slower elements, override default
  timeout

- Situation-2: 
   Sometimes we hold reference of elements as jquery for too long
   cy.get('button').then(($btn) => {
   
   step-
   step-
   step-
   step-

   cy.wrap($btn).click()   // this is flaky part

   })

   Remember: Jquery is static one and doesn't retry itself again and again
             The initial reference even though may be wrong, or unrendred, will be stored

  Solution: 
  - Simply grab the element when fully rendered, in this case, grab the button in last after all steps
    don't grab too early
  - Use alias, alias will requery itself again

    cy.get('button').as('alias')
    step
    step
    step
    step
    cy.get(@alias).click()  // if not found, it will requery itself, reduces flakiness

- Situation 3: Iframes inside a bigger frame with different domains can have error due to cross origin
               So, disable chrome security, chromeWebSecurity: false

- Situation 4: Sometimes, there can be some popups that hide DOM elements and can cause failures
  CASE - 1: If we have access to application code, and we find that the popup is shown when some localstorage is
            set, ex: hidePopup: false => make it true in cypress in beforeEach hook

  CASE - 2: If we don't have access to the app source code, only UI access is there, then we can use
            conditional testing to hide that popup

            cy.get('body').then(($body) => {
              if($body.find('popup').length > 0) // close it
            })

            
- TODO after intercept concept
  Instead of just relying on stable DOM, we can also wait for intercepted calls
  using intercept() xhr requests

  cy.intercept('POST', /regexp/).as(req)
  cy.click()
  cy.wait(@req)

  Use cy.intercept() to wait for the XHR request to finish execution.

- use assertions like should('be.visible), contains().. before any actions like
  click(), type()

- Make sure to configure below timeouts
    defaultCommandTimeout
    execTimeout
    taskTimeout
    pageLoadTimeout
    requestTimeout
    responseTimeout

    Use timeouts instead of waits

- avoid hardcoded waits cy.wait(2000)

- Be careful in conditional testing

- Optimise selectors/locators

-   Test retries

    Use cy.retry() Plugin: Install the Cypress retry plugin to automatically retry failed assertions.
    // Install the plugin first: npm install -D cypress-plugin-retries
    require('cypress-plugin-retries');

    // Enable retries in your test
    Cypress.env('RETRIES', 2);

    // Example test with retries
    it('should display data after retry', () => {
        cy.visit('/data-page');
        cy.get('.data-item').should('have.length', 10); // Retry if fails
    });

*/