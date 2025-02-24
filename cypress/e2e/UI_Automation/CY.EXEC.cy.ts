/* Execute a system command.


Read about best practices here.

Syntax
    cy.exec(command)
    cy.exec(command, options)

cy.exec('npm run build')

cy.exec() yields an object with the following properties:
    code
    stdout
    stderr

EXAMPLES:

cy.exec('npm run build').then((result) => {
  // yields the 'result' object
  // {
  //   code: 0,
  //   stdout: "Files successfully built",
  //   stderr: ""
  // }
})

cy.exec('rake db:seed').its('code').should('eq', 0)

Write to a file to create a fixture from response body
cy.intercept('POST', '/comments').as('postComment')
cy.get('.add-comment').click()
cy.wait('@postComment').then(({ response }) => {
  cy.exec(
    `echo ${JSON.stringify(response.body)} >cypress/fixtures/comment.json`
  )
  cy.fixture('comment.json').should('deep.eq', response.body)
})

Commands that do not exit are not supported
cy.exec() does not support commands that don't exit, such as:
    Starting a rails server
    A task that runs a watch
    Any process that needs to be manually interrupted to stop
    A command must exit within the execTimeout or Cypress will kill 
    the command's process and fail the current test.

*/