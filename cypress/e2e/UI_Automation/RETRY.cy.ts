/*
By default, tests will not retry when they fail. You'll need to enable 
test retries in your configuration to use this feature.

/*
import { defineConfig } from 'cypress'

export default defineConfig({
  retries: 2,
})

Once test retries are enabled, tests can be configured to have X number of retry 
attempts. For example, if test retries have been configured with 2 retry 
attempts, Cypress will retry tests up to 2 additional times (for a total 
of 3 attempts) before potentially being marked as a failed test.


When each test is run again, the following hooks will be re-run also:
beforeEach
afterEach

However, failures in before and after hooks will not trigger a retry.

-------------------------------------------------------------------------------------------------------
                                                CONFIGURATION

Global Configuration:

    export default defineConfig({
    retries: {
        // Configure retry attempts for `cypress run`
        // Default is 0
        runMode: 2,
        // Configure retry attempts for `cypress open`
        // Default is 0
        openMode: 0,
    },
    })


    If you want to configure the retry attempts for all tests run in both cypress run and cypress open,

    export default defineConfig({
    retries: 1,
    })


Custom Configurations:

Individual Test(s).

// Customize retry attempts for an individual test
describe('User sign-up and login', () => {
  // `it` test block with no custom configuration
  it('should redirect unauthenticated user to sign-in page', () => {
    // ...
  })

  // `it` test block with custom configuration
  it(
    'allows user to login',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      // ...
    }
  )
})

Test Suite(s)

// Customizing retry attempts for a suite of tests
describe(
  'User bank accounts',
  {
    retries: {
      runMode: 2,
      openMode: 1,
    },
  },
  () => {
    // The per-suite configuration is applied to each test
    // If a test fails, it will be retried
    it('allows a user to view their transactions', () => {
      // ...
    })

    it('allows a user to edit their transactions', () => {
      // ...
    })
  }
)

-------------------------------------------------------------------------------------------------------




Can I access the current attempt counter from the test?
you can use Cypress.currentRetry. 
If you want to determine the total allowed attempts you can do the following:

it('does something differently on retry', { retries: 3 }, () => {
  // Cypress.currentRetry returns the current test retry count
  const attempt = Cypress.currentRetry

  // cy.state('runnable') returns the current test object
  // we can grab the total allowed attempts from its properties
  const retries = cy.state('runnable')._retries

  // use the "attempt" and "retries" values somehow
})

SCREENSHOTS:
When a test retries, Cypress will continue to take screenshots for each failed attempt or 
cy.screenshot() and suffix each new screenshot with (attempt n), corresponding to the 
current retry attempt number.
*/

describe("WORKFLOWS", {
    retries: {
        runMode: 2,
        openMode: 2
    }
}, () => {
    it("should pass test 1", () => expect(true).to.be.true);
    it("should pass test 2", () => expect(1 + 1).to.equal(2));
    it("should fail test 3", () => expect(true).to.be.false);
  });
  