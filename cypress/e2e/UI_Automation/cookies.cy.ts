/* The Cookie is a small message from a web server passed to the user's
 browser when you visit a website. In other words, Cookies are small text 
 files of information created/updated when visiting a website and stored on 
 the user's web browser. 

 HTTP is a sessionless protocol, so after providing the user with web page,
it forgots the 
session, to help it remember the session and other details of user 
Cookies are stored in the browser, they help to recognise the user mainly

Types of Cookies:

Session cookies:
- present as long as the user browser is open. Session cookies are deleted once 
  the browser is closed and the user's session is inactive 

Persistent cookies
- last longer than session cookies. Persistent cookies are stored on the user's 
  device for a specific period ( for less than 6 months ).

First-party cookies
- set by the website that you are currently visiting.
- used to provide better UX

Third-party cookies
- set by the domains that you are not visiting. Third-party cookies are mostly
  used for cross-site tracking and advertising purposes these cookies collect data
  about your browsing habits and serve ads according to it.
- ex: facebook cookies

Benefits:
User Convenience: 
- Cookies mainly enhance user experience by storing user preferences like 
language settings, shopping cart items, etc, dark mode light mode. (theme part is also stored in localstorage)

Tracking: 
- Cookies are used as trackers to collect user's behaviour which will be helpful 
  for marketing strategies, improving content, etc.

Authentication: 
- Cookies are essential for maintaining the user's session and authentication to 
  stay logged in.

                        WAYS TO SET AND GET COOKIES

WAY-1: Manually
ex: u can set cookie using document.cookie = <Name> : <Id> : <Company>
    u can get cookie using document.cookie only


<script>
    function setCookie(name, value, daysToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
        console.log(name+" cookie created");
    }

    // read cookie
    function getCookie(name) {
        console.log(document.cookie);
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(name + "=") === 0) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    // delete cookie
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        console.log(name+" cookie deleted");
    }

    // Set a cookie
    setCookie("userLanguage", "en-US", 30);

    // Read a cookie
    const language = getCookie("userLanguage");
    console.log("User's language: " + language);

    // Delete a cookie
    deleteCookie("userLanguage");
</script>

WAY-2 (Context: Cypress): Using built in cypress functions
 
*/

import { uiTimeout } from "../../fixtures/commonData";

describe('Workflows', () => {

    it('Managing directly through documents object', () => {
        cy.visit('https://docs.cypress.io/api/commands/window', { timeout: uiTimeout }).then(() => {
            cy.document().then((docObj) => {
                docObj.cookie = 'AD';  // set cookie
                expect(docObj.cookie).to.equal('AD')  // get cookie
            });
        });
    });

    it('Using cypress built in commands', () => {
        cy.visit('https://docs.cypress.io/api/commands/window', { timeout: uiTimeout }).then(() => {

            /* setCookie():
              - Syntax: cy.setCookie(name, value, options)
              - cy.setCookie() will only run assertions you have chained once, and will not retry.
             
               getCookie():
              - Get a browser cookie by its name.
              - cy.getCookie(name, options), name is compulsory
              - It is not a query. It will not retry, or wait for the requested cookie to exist.
              - When a cookie matching the name could not be found: cy.getCookie() yields null.

               getCookies():
              - Get browser cookies for the current domain or the specified domain.

              // assume we just logged in
                cy.contains('Login').click()
                cy.url().should('include', 'profile')
                cy.getCookies()
                .should('have.length', 1)
                .then((cookies) => {
                    expect(cookies[0]).to.have.property('name', 'session_id')
                })

                Cypress automatically clears all cookies before each test to prevent state from being 
                shared across tests when test isolation is enabled. You shouldn't need to use this command 
                unless you're using it to clear a specific cookie inside a single test or test isolation is 
                disabled.

               clearCookies():
              - cy.clearCookies() yields null.

               clearCookie():
              - Clear a specific browser cookie.
              - cy.clearCookie('authId') // clear the 'authId' cookie
              - cy.clearCookie() yields null.
            */

            cy.clearAllCookies().then(() => {
                cy.getCookie('AD').should('be.null');
                cy.setCookie('AD', 'VALUE');

                // Wait for the cookie to be set and assert properly
                cy.getCookie('AD').then((cookie) => {
                    console.warn('COOKIE -> ', cookie);  // Logs the actual cookie object

                    /* Cookie object
                     const cookieObject = {
                    domain: ".docs.cypress.io",
                    expiry: 1774193679.391213,
                    httpOnly: false,
                    name: "AD",
                    path: "/",
                    secure: false,
                    value: "VALUE"
                    }; */

                    expect(cookie).to.have.property('name', 'AD'); // Ensure the cookie name is 'AD'
                    expect(cookie).to.have.property('value', 'VALUE'); // Ensure the cookie value is 'VALUE'

                    cy.clearAllCookies().then(() => {
                        cy.getCookie('AD').should('be.null');
                    });

                });
            });
        });
    });

    it.only('Cypress.Cookies API usage', () => {

        /* Cookies.debug() enables you to generate logs to the console whenever any cookies are modified.
        Syntax: Cypress.Cookies.debug(enable, options)

        Arguments:
        --------

        - enable (Boolean): Whether cookie debugging should be enabled.
        - options (Object): Pass in an options object to control the behavior of Cookies.debug().
                            verbose	Whether or not to display the entire cookie object.	true 
                            
           
        Use of these cookies:
        ---------------------

        Log when cookie values are created, modified or deleted. By turning on debugging, Cypress will 
        automatically generate logs to the console when it sets or clears cookie values. This is useful to 
        help you understand how Cypress clears cookies before each test, and is useful to visualize how to 
        handle preserving cookies in between tests.*/

        cy.visit('https://docs.cypress.io/api/commands/window', { timeout: uiTimeout }).then(() => {
            Cypress.Cookies.debug(true) // now Cypress will log when it alters cookies
            cy.clearAllCookies()
            cy.setCookie('foo', 'bar')
            cy.clearCookie('foo')
            cy.setCookie('foo', 'bar_UPDATED')
            cy.clearCookie('foo')
        });
    });
});