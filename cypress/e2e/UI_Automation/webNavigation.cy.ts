/*  Different ways

    - cy.visit('/') // visits the baseUrl set in config file
    - cy.visit('index.html') // visits the local file "index.html" if baseUrl is null
    - cy.visit('http://localhost:3000') // specify full URL if baseUrl is null or the domain 
                                        // is different the baseUrl
    - cy.visit({
        url: '/pages/hello.html',
        method: 'GET',
      })

--> cy.visit() YEILDS the window object after the page finishes loading.
--> By default, the cy.visit() commands' will use the pageLoadTimeout and baseUrl 
    set globally in your configuration.

*/

describe('cy.visit() test suite', () => {

    it('check language of the visited page', () => {
        cy.visit('/').then((winObj) => {
            expect(winObj.navigator.language).to.eq('en-US');
        });
    });

    /* When baseUrl is not provided:
    Error: We failed looking for this file at the path: /CypressProject/ui-automation-project/
    Cypress will automatically attempt to serve your files if you don't provide a host and 
    baseUrl is not defined. The path should be relative to your project's root folder 
    (the directory that contains the Cypress configuration file). 
    
    cy.visit() requires the response to be content-type: text/html. */

    /* Visit is automatically prefixed with baseUrl*/
    it('visit is automatically prefixed with baseUrl in cypress', () => {
        // actually visits https://automatenow.io/cypress-tutorials/
        //                 |---baseUrl-----------|
        cy.visit('cypress-tutorials').then((winObj) => {
            expect(winObj.navigator.language).to.eq('en-US');
        });
    });

    /* Overrides the pageLoadTimeout set globally in your configuration for this page load.
    cy.visit('/index.html', { timeout: 30000 }) // Wait 30 seconds for page 'load' event 
    
                                VARIOUS callbacks provided

---------------------------------------------------------------------------------------------------
onBeforeLoad is called as soon as possible, before your page has loaded all of its resources. 
Your scripts will not be ready at this point, but it's a great hook to potentially manipulate the page.

cy.visit('http://localhost:3000/#dashboard', {
  onBeforeLoad: (contentWindow) => {
    // contentWindow is the remote page's window object
  },
})

USE:
Bootstrapping your App

n computing, the term bootstrap means to boot or to load a program into a computer 
using a much smaller initial program to load in the desired program, which is usually an OS.

Set a token to localStorage for login during Single Sign On (SSO)
---------------------------------------------------------------------------------------------------
onLoad is called once your page has fired its load event. 
All of the scripts, stylesheets, html and other resources are GUARATEED to be available at this point.

cy.visit('http://localhost:3000/#/users', {
  onLoad: (contentWindow) => {
    // contentWindow is the remote page's window object
    if (contentWindow.angular) {
      // do something
    }
  },
})

---------------------------------------------------------------------------------------------------
Add query parameters by passing qs to options.

// visits http://localhost:3500/users?page=1&role=admin
cy.visit('http://localhost:3500/users', {
  qs: {
    page: '1',
    role: 'admin',
  },
})

The parameters passed to qs will be merged into existing query parameters on the url.

// visits https://example.cypress.io/users?page=1&admin=true
cy.visit('https://example.cypress.io/users?page=1', {
  qs: { admin: true },
})
---------------------------------------------------------------------------------------------------

Visit local file when baseUrl is set --> SET { baseUrl: null } in 'it' block
If you have baseUrl set, but need to visit a local file in a single test or a group of tests, 
disable the baseUrl using per-test configuration. Imagine this Cypress configuration:

export default defineConfig({
  e2e: {
    baseUrl: 'https://example.cypress.io',
  },
})

The first test visits the baseUrl, while the second test visits the local file.

it('visits base url', () => {
  cy.visit('/')
  cy.contains('h1', 'Kitchen Sink')
})

it('visits local file', { baseUrl: null }, () => {
  cy.visit('index.html')
  cy.contains('local file')
})

---------------------------------------------------------------------------------------------------
Visit will automatically follow redirects
// we aren't logged in, so our web server
// redirected us to /login
cy.visit('http://localhost:3000/admin')
cy.url().should('match', /login/)

---------------------------------------------------------------------------------------------------
Protocol can be omitted from common hosts
Cypress automatically prepends the http:// protocol to common hosts. If you're not using one of these 3 hosts, then make sure to provide the protocol.

cy.visit('localhost:3000') // Visits http://localhost:3000
cy.visit('0.0.0.0:3000') // Visits http://0.0.0.0:3000
cy.visit('127.0.0.1:3000') // Visits http://127.0.0.1:3000   */
});