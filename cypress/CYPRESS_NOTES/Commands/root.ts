/* cy.root()

Get the root DOM element.

Syntax:
cy.root()
cy.root(options)

cy.root() // Yield root element <html>

cy.get('nav').within(($nav) => {
  cy.root() // Yield root element <nav>
})

The root element yielded is <html> by default. However, when calling 
.root() from a .within() command, the root element will point to the 
element you are "within".

cy.get('form').within(($form) => {
  cy.get('input[name="email"]').type('john.doe@email.com')
  cy.get('input[name="password"]').type('password')
  cy.root().submit() // submits the form yielded from 'within'
})

cy.root().should('match', 'html')

cy.get('.query-ul').within(() => {
  cy.root().should('have.class', 'query-ul')
})


*/