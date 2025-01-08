/*
Get the current URL of the page that is currently active.

This is an alias of cy.location('href')
cy.url() uses href under the hood.

cy.url() // Yields the current URL as a string
cy.location('href') // these yield the same string

clicking the anchor causes the browser to follow the link:
cy.get('#user-edit a').click()
cy.url().should('include', '/users/1/edit') // => true
cy.url().should('eq', 'http://localhost:8000/users/1/edit') // => true

decode option:
When the URL contains non-ASCII characters, use the decode option.

// For the curious, '사랑' means 'love' in Korean.
cy.url({ decode: true }).should('contain', '사랑')


cy.url().should('contain', '#users/new')

cy.url().should('eq', 'http://localhost:8000/index.html')
cy.url().should('eq', Cypress.config().baseUrl + '/index.html') // tests won't fail in case the port changes
*/