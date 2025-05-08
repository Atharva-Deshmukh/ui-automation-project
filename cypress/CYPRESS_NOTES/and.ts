/*

In most cases, .and() yields the same subject it was given.
.and() is an assertion, and it is safe to chain further commands that use the subject.
cy.get('nav') // yields <nav>
  .should('be.visible') // yields <nav>
  .and('have.class', 'open') // yields <nav>

However, some chainers change the subject. In the example below, 
.and() yields the string sans-serif because the chainer have.css, 'font-family' changes the subject.

cy.get('nav') // yields <nav>
  .should('be.visible') // yields <nav>
  .and('have.css', 'font-family') // yields 'sans-serif'
  .and('match', /serif/) // yields 'sans-serif'



  cy.get('button')
  .should('be.active')
  .and(($button) => {
    expect({ foo: 'bar' }).to.deep.eq({ foo: 'bar' })

    return { foo: 'bar' } // return is ignored, .and() yields <button>
  })
  .then(($button) => {
    // do anything we want with <button>
  })


  cy.get('input', {timeout: 10000}).should('have.value', 'US').and(($input) => {
                         ↲
  // timeout here will be passed down to the '.and()'
  // unless an assertion throws earlier,
  // ALL of the assertions will retry for up to 10 secs
  
  expect($input).to.not.be('disabled')
  expect($input).to.not.have.class('error')
})
*/