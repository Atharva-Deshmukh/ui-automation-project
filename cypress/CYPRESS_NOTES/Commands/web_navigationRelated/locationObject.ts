describe('cy.location() object suites', () => {

    /* Notes: cy.location()
    - Gets the global window.location object of the page that is currently active.

    Syntax
    cy.location() // Get location object
    cy.location(key)

    ex: 
    cy.location('host') // Get the host of the location object
    cy.location('port') // Get the port of the location object


    When given a key argument:
    - cy.location() yields the value of the location property as a string

    When not given a key argument:
    - cy.location() yields the location object with the following properties:

    - hash
    - host
    - hostname
    - href
    - origin
    - pathname
    - port
    - protocol
    - search
    - toString

| Property   | Example Value                                              | Description                      |
|------------|------------------------------------------------------------|----------------------------------|
| hash       | #section      (part after hash in URL)                     | Fragment identifier              |
| host       | example.com:8080                                           | Domain + port                    |
| hostname   | example.com                                                | Domain only                      |
| href       | https://example.com:8080/path/to/page?query=123#section    | Full URL                         |
| origin     | https://example.com:8080                                   | Protocol + hostname + port       |
| pathname   | /path/to/page                                              | Path of the URL                  |
| port       | 8080                                                       | Port number                      |
| protocol   | https:                                                     | Protocol                         |
| search     | ?query=123                                                 | Query string                     |
| toString   | https://example.com:8080/path/to/page?query=123#section    | Full URL as a string             |


Advantage Native Location
- No need to use window.location
- Cypress automatically normalizes the cy.location() command and strips out extraneous 
  values and properties found in window.location. Also, the object literal yielded by cy.location() is a basic object literal,
  not the special window.location object.
- When changing properties on the real window.location object, it forces the browser to navigate away. In Cypress, 
  the object yielded is a plain object, so changing its properties will have no effect on navigation.

  cy.window().then((win) => {
    console.log(win.location)
  }) */

    it('access whole location object and log its property', () => {
        cy.visit('https://demo.automationtesting.in/Register.html').then(() => {
            cy.location().then((location) => {
                // Access various properties of the location object
                console.warn('Current URL:', location.href);
                console.warn('Hostname:', location.hostname);
                console.warn('Pathname:', location.pathname);
                console.warn('Search/Query params:', location.search);
                console.warn('Protocol:', location.protocol);
              });
        });
    });

});