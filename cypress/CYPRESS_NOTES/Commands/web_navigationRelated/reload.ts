/*
Syntax
cy.reload()
cy.reload(forceReload)

Reload the page as if the user clicked 'Refresh'

cy.visit('http://localhost:3000/admin')
cy.get('#undo-btn').click().should('not.be.visible')
cy.reload()
cy.get('#undo-btn').click().should('not.be.visible')

Force Reload (ctrl + f5) => force refresh/hard refresh

Reload the page without using the cache
cy.visit('http://localhost:3000/admin')
cy.reload(true)
*/