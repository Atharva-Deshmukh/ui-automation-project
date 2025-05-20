/* Cache and restore the context between tests

Syntax: 
cy.session(id, setup, options)  --> yeilds null

id: 
- A unique identifier that will be used to cache and restore a given session.
- If you pass ['Jane', '123', 'admin'], an id of ["Jane","123","admin"] will be generated for you.


 setup():
 - Called whenever a session for the given id hasn't yet been cached, or if it's no longer valid 
 - After setup and validate runs for the first time, Cypress will preserve all cookies, sessionStorage, 
   and localStorage, so that subsequent calls to cy.session() with the same id will BYPASS setup and 
   just restore and validate the cached session data.

 - The page is cleared before setup when testIsolation = true 
   and is not cleared when testIsolation = false

   Cookies, local storage and session storage in all domains are always cleared before 
   setup runs, regardless of the testIsolation configuration
   Since, setup() run hua means new session create hora hai due to any failure.

options(Object):

  It has two things:

  validate():
  - Function to run immediately after the session is created and setup function runs 
  - or after a session is restored and the page is cleared. 
  - If it throws an exception, contains any failing Cypress command, returns a Promise which 
    rejects or resolves to false, or the last  Cypress command yielded false, 
    the session is considered invalid.

 - If validation fails immediately after setup, the test will fail since session cannot be created like this.
 - If validation fails after restoring a session, setup will re-run, since, creation ke time session correct 
   tha

cacheAcrossSpecs: false by default
    When enabled, the newly created session is considered "global" and can be restored in any spec 
    during the test execution in the same Cypress run on the same machine. 


Use cy.session() inside beforeEach with testIsolation: false
It saves time for relogin,
Don't logout in afterEach() since session() only takes care of cookies and localstorage, sessionStorage
It doesn't take care of UI state.

If u use cy.session() with testIsolation: true, default blank cypress page will come up
cy.session() takes care of localstorage, sessionstorage and cookies, but doesn't automatically redirects there
Hence, use cy.visit() at that time. in each it block

NOTE: cy.session() misbehaves with testIsolation: true, since All sessionData, localStorage and cookies are
automatically cleared between tests.

NOTES BELOW
*/

describe('WORKFLOWS', () => {

    beforeEach(() => {
      cy.session(
        'LOGIN_SESSION', 
        () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {timeout: 30000})
       .then(() => {
         cy.get('input[name="username"]', {timeout: 30000}).should('be.visible').type('Admin');
         cy.get('input[name="password"]', {timeout: 30000}).should('be.visible').type('admin123');
         cy.get('button[type="submit"]', {timeout: 30000}).should('be.visible').click();
         cy.url().should('contain', 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
         cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).should('be.visible');
        }); 
      }, 
      {
        validate() {
            cy.url().should('contain', 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
            cy.get('.oxd-userdropdown-tab', { timeout: 10000 }).should('be.visible');
        }
      })

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    });

    it('Test-1', () => {
      cy.get('.oxd-main-menu-search', {timeout: 30000}).should('be.visible');
    });

    it('Test-2', () => {
      cy.get('.oxd-main-menu-search', {timeout: 30000}).should('be.visible');
    });

    it('Test-3', () => {
      cy.get('.oxd-main-menu-search', {timeout: 30000}).should('be.visible');
    });

    // afterEach(() => {
    //   cy.get('.oxd-userdropdown-tab > .oxd-icon', {timeout: 30000}).should('be.visible').click();
    //   cy.get('.oxd-userdropdown-link:contains("Logout")', {timeout: 30000}).should('be.visible').click();
    //   cy.url().should('include', 'login');
    // });

});

/*
Switching sessions inside tests
Because cy.session() clears the page and all session data before running setup, 
you can use it to easily switch between sessions without first needing to log the previous user out. 
This allows tests to more accurately represent real-world scenarios and helps keep test run times short.

const login = (name) => {
  cy.session(name, () => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: { name, password: 's3cr3t' },
    }).then(({ body }) => {
      window.localStorage.setItem('authToken', body.token)
    })
  })
}

it('should transfer money between users', () => {
  login('user')
  cy.visit('/transfer')
  cy.get('#amount').type('100.00')
  cy.get('#send-money').click()

  login('other-user')
  cy.visit('/account_balance')
  cy.get('#balance').should('eq', '100.00')
})

If your custom login command returns a value that you use to assert in a test, 
wrapping it with cy.session() will break that test. However, it's usually easy to solve this 
by refactoring the login code to assert directly inside setup.

Before

Cypress.Commands.add('loginByApi', (username, password) => {
  return cy.request('POST', `/api/login`, {
    username,
    password,
  })
})

it('should return the correct value', () => {
  cy.loginByApi('user', 's3cr3t').then((response) => {
    expect(response.status).to.eq(200)
  })
})

After

Cypress.Commands.add('loginByApi', (username, password) => {
  cy.session(username, () => {
    cy.request('POST', `/api/login`, {
      username,
      password,
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})

it('is a redundant test', () => {
})
*/