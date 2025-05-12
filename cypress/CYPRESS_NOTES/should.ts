/* should(($ele) => {})

Creates an assertion. Assertions are automatically retried until they pass or time out.

IMP!!
cy.get('input', { timeout: 10000 }).should(($input) => {
  // timeout here will be passed down to the '.should()'
  // unless an assertion throws earlier,
  // ALL of the assertions will retry for up to 10 secs
  expect($input).to.not.be('disabled')
  expect($input).to.not.have.class('error')
  expect($input).to.have.value('US')
})


                What's the difference between .then() and .should()/.and()?
                ----------------------------------------------------------

Using .then(): allows you to use the yielded subject in a callback function and should 
be used when you need to manipulate some values or do some actions.

Using a callback function with .should() or  .and(): 
There is special logic to rerun the callback function until no assertions throw within it. 
You should be careful of side affects in a .should() or .and() callback function that you would 
not want performed multiple times.

Call back inside should(()) is retried unlike the one inside then(())

In most cases, .should() yields the same subject it was given from the previous command.
But the YEILD IS MODIFIED AS PER THE ASSERTION
        cy.get('nav') // yields <nav>
        .should('be.visible') // yields <nav>
        .should('have.css', 'font-family') // yields 'sans-serif'
        .and('match', /serif/) // yields 'sans-serif'

  Assert the anchor element has href attribute
        cy.get('#header a').should('have.attr', 'href')

        Assert the href attribute is equal to '/users'
        cy.get('#header a').should('have.attr', 'href', '/users')

        Note: the have.attr assertion changes the subject from the original element to the attribute's value

        cy.get('#header a') // yields the element
        .should('have.attr', 'href') // yields the "href" attribute
        .and('equal', '/users') // checks the "href" value


 You cannot invoke Cypress commands inside of a .should() callback function. 
 Use Cypress commands before or after .should() instead.
 
                                        INCORRECT:
 cy.get('p').should(($p) => {
  cy.log($p)
  // ...
})

                                          CORRECT:
cy.get('p')
  .should(($p) => {
    // ...
  })
  .log()

                                    // or use it inside then()
cy.get('p').then(($p) => {
  // ...
  cy.log($p)
})

                        Any value returned from a .should() callback function will be ignored. 
                        The original subject will be yielded to the next command.

cy.get('p')
  .should(($p) => {
    expect($p).to.have.length(3)
    return 'foo'
  })
  .then(($p) => {
    // the argument $p will be the 3 elements, not "foo"
  })

  cy.get('button')
  .should(($button) => {
    expect({ foo: 'bar' }).to.deep.eq({ foo: 'bar' })
    return { foo: 'bar' } // return is ignored, .should() yields <button>
  })
  .then(($button) => {
    // do anything we want with <button>
  })


                                                        Getting classnames:
  cy.get('.docs-header')
  .find('div')
  // .should(cb) callback function will be retried
  .should(($div) => {
    expect($div).to.have.length(1)

    const className = $div[0].className

    expect(className).to.match(/heading-/)
  })
  // .then(cb) callback is not retried,
  // it either passes or fails
  .then(($div) => {
    expect($div).to.have.text('Introduction')
  })

                                        We can also throw errors from should(()) callback
  cy.get('.docs-header')
  .find('div')
  .should(($div) => {
    if ($div.length !== 1) {
      // you can throw your own errors
      throw new Error('Did not find 1 element')
    }

    const className = $div[0].className

    if (!className.match(/heading-/)) {
      throw new Error(`No class "heading-" in ${className}`)
    }
  }) */

