/*
The ping attribute specifies a list of URLs to be notified if the user follows the hyperlink.
When the user clicks on the hyperlink, the ping attribute will send a short HTTP POST request 
to the specified URL.

This attribute is useful for monitoring/tracking.

Ex: <a href="https://www.w3schools.com/html" ping="https://www.w3schools.com/trackpings">

Google majorly uses it to track the url visited by the user


                                            Way to test it:
                                            --------------

    A ping attribute is basically a POST with headers containing: ping-from and ping-to mainly containing
    URLs, just assert them

    cy.intercept({
        method: 'POST',
        url: 'inspect the URL '
    }).as('ping');

    cy.get('@ping').its('requestHeaders').should('deep.include', {
        ping-from: 'URL to get from inspect'
        ping-to: 'URL to get from inspect'
    });

*/