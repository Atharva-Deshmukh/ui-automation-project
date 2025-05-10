 /*
Get the current URL hash of the page that is currently active.

This is an alias of cy.location('hash')

Syntax
cy.hash()
cy.hash(options)

Usage
 Correct Usage

cy.hash() // Get the url hash


Assert that hash is #/users/1 given remote URL: http://localhost:8000/app/#/users/1

// yields #/users/1
cy.hash().should('eq', '#/users/1') // => true

Assert that the hash matches via RegExp
<ul id="users">
  <li>
    <a href="#/users/8fc45b67-d2e5-465a-b822-b281d9c8e4d1">Fred</a>
  </li>
</ul>

cy.get('#users li').find('a').click()
cy.hash().should('match', /users\/.+$/) // => true

*/