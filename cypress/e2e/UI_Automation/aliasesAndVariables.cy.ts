/* Typically in Cypress you hardly need to ever use const, let, or var. 
When using closures (the .then($ele)) you'll always have access to the objects
that were yielded to you without assigning them.


                                                WHY ALIASES

Using .then() callback functions to access the previous command values is great—but what 
happens when you're running code in hooks like before or beforeEach?

beforeEach(() => {
  cy.get('button').then(($btn) => {
    const text = $btn.text()
  })
})

it('does not have access to text', () => {
  // how do we get access to text ?!?!
})

How will we get access to text?
- AN UGLY WORKAROUND: declare a global variable

describe('a suite', () => {
  // this creates a closure around
  // 'text' so we can access it
  let text

  beforeEach(() => {
    cy.get('button').then(($btn) => {
      // redefine text reference
      text = $btn.text()
    })
  })

  it('does have access to text', () => {
    // now text is available to us
    // but this is not a great solution :(
    text
  })
})

it('Use of const', () => {

    The reason for using const is because the $span object is mutable. Whenever you have mutable objects 
    and you're trying to compare them,  you'll need to store their values. Using const is a perfect way to
    do that. 
        
    cy.get('[data-testid="num"]').then(($span) => {
        // capture what num is right now
        const num1 = parseFloat($span.text())
          
         cy.get('button')
            .click()
            .then(() => {
            // now capture it again
            const num2 = parseFloat($span.text())
          
            // make sure it's what we expected
            expect(num2).to.eq(num1 + 1)
            })
        })
});

Alias names cannot match some reserved words.
These words include: test, runnable, timeout, slow, skip, and inspect.



                                            WAYS TO ACCESS ALIASES

- using shared context object of mocha and accessing it using 'this' keyword
  Note that here, we cannot use () => {}, since we are dealing with 'this' keyword.
  Under the hood, aliasing basic objects and primitives utilizes Mocha's shared context object: 
  that is, aliases are available as this.*. Mocha automatically shares contexts for us across all 
  applicable hooks for each test. Additionally these aliases and properties are automatically cleaned 
  up after each test.

- Other way: use cy.get('.class').as(alias)
                 cy.get('@alias').assertions()
  The cy.get() command is capable of accessing aliases with a special syntax using the @ character.

                                            PRECAUTIONS while using this.

    Do not forget that Cypress commands are async!
    You cannot use a this.* reference until the .as() command runs.

    it('is not using aliases correctly', function () {
        cy.fixture('users.json').as('users')

        // nope this won't work
        // this.users is not defined because the 'as' command has only been enqueued - it has not run yet
        const user = this.users[0]
    })

If you want to access what a command yields you have to do it in a closure using a .then().

// yup all good
cy.fixture('users.json').then((users) => {
  // now we can avoid the alias altogether and use a callback function
  const user = users[0]

  // passes
  cy.get('header').should('contain', user.name)
})


                                                USE CASES FOR BOTH

- When using this.users, it is stored on the context when it is first evaluated, it does not retries
- But when using cy.get('@users'), any queries are re-evaluated every time the alias is accessed.

Cypress aliases (as('colorAlias')) are dynamically re-evaluated only when accessed using cy.get('@colorAlias').


 It is recommended that you alias elements before running commands.
    - cy.get('nav').find('header').find('[data-testid="user"]').as('user').click()  (good)
    - cy.get('nav').find('header').find('[data-testid="user"]').click().as('user')  (bad)


                                                COMMON USES

Example of aliasing an intercepted route and waiting on it to complete.

cy.intercept('POST', '/users', { id: 123 }).as('postUser')
cy.get('form').submit()
cy.wait('@postUser').then(({ request }) => {
  expect(request.body).to.have.property('name', 'Brian')
})
cy.contains('Successfully created user: Brian')


Example of aliasing a request and accessing its properties later.

cy.request('https://jsonplaceholder.cypress.io/comments').as('comments')
// other test code here
cy.get('@comments').should((response) => {
  if (response.status === 200) {
      expect(response).to.have.property('duration')
    } else {
      // whatever you want to check here
    }
  })
})


                                                OPTIONS TO PASS IN as()

Option    Default    Description
----------------------------------
type      query      The type of alias to store, which impacts how the value is retrieved later in the test.
                     Valid values are "query" and "static".
                     - A "query" alias re-runs all queries leading up to the resulting value each time 
                       the alias is requested.
                     - A "static" alias is retrieved once when the alias is stored and will never change.
                     - "type" has no effect when aliasing intercepts, spies, and stubs.

------------------------------------------------------------------------------------------------------
                                        SOME INTERESTING USE CASES
------------------------------------------------------------------------------------------------------
WE can use alias to save us from pyramid of doom :

cy.then((resp1) => {
    cy.then((resp2) => {
        cy.then((resp3) => {
                resp1 + resp2 + resp3
        })
    })
})

we can simply alias them and use

cy.get(resp1).as(resp1Alias)
cy.get(resp2).as(resp2Alias)
cy.get(resp3).as(resp3Alias)

cy.then(() => {
    this.resp1Alias + this.resp2Alias + this.resp3Alias
})

-----------------------------------------------------------------------------------------------
When some locator changes, we need to make changes everywhere it is used
So, this is tedious

WORKAROUNDS:

- Declare a global locator in helper file and call it
- Alias the locator and then call it


cy.get('target').as('targetAlias');
cy.get('@targetAlias').find(..)
----------------------------------------------------------------------------------------------

We can also use alias for those elements that change within 2 seconds,
normally, cy.get().expect(), the element obtained by cy.get() will change and expectation fails
but with alias, it retries

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('WAY-1', () => {

    before(() => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
        cy.get('#hide-textbox', {timeout: uiTimeout})
        .scrollIntoView()
        .should('be.visible')
        .as('btnAlias');
    });

    it('Test-1', function() {
         expect(this.btnAlias).to.have.attr('type', 'submit');
    });

    // Aliases are cleared after every tests, hence either declare the in beforeEach, or separately in 
    // every individual tests
    it('Test-2', function() {
         expect(this.btnAlias).to.not.exist;
    });

});

describe('WAY-2', () => {

    before(() => {
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/', {timeout: uiTimeout});
        cy.get('#hide-textbox', {timeout: uiTimeout})
        .scrollIntoView()
        .should('be.visible')
        .as('btnAlias');
    });

    it('Test-1', function() {
        cy.get('@btnAlias').should('have.attr', 'type', 'submit');
    });

    // Aliases are cleared after every tests, hence either declare the in beforeEach, or separately in 
    // every individual tests
    it('Test-2', function() {
        // cy.get('@btnAlias').should('be.undefined');  // TEST FAILS HERE
    });
});

it('Alias (without "this") will always retry, thus storing latest value', function() {
    // I have combined both types of aliases in a single it block
    let obj = {color: 'red'};

    cy.wrap(obj).its('color').as('colorAlias');

    cy.get('@colorAlias').should('equal', 'red'); // this will update
    cy.then(() => {
        expect(this.colorAlias).to.eq('red'); // this will not update
    })

    cy.then(() => {
        obj.color = 'red_UPDATED';
    });

    cy.get('@colorAlias').should('equal', 'red_UPDATED');
    cy.then(() => {
        expect(this.colorAlias).to.eq('red');
    })
});

it('Alias (with "this") will NOT  retry, thus storing first value', function() {
    let obj = {color: 'red'};

    cy.wrap(obj).its('color').as('colorAlias');

    // don't write this expect() directly, use cy.then just like above

    expect(this.colorAlias).to.eq('red'); // this will not update

    cy.then(() => {
        obj.color = 'red_UPDATED';
    });

    expect(this.colorAlias).to.eq('red');
});

it.only('PRESERVING INTITAL VALUE WITH ALIAS', function() {
    let obj = {color: 'red'};

    cy.wrap(obj).its('color').as('colorAlias', {type: 'static'});  // stores only initial state, even after retrying
                                                                   // this was default behaviour of cypress and aliases before version 12
    cy.get('@colorAlias').should('equal', 'red'); 
    cy.then(() => {
        expect(this.colorAlias).to.eq('red');
    })

    cy.then(() => {
        obj.color = 'red_UPDATED';
    });

    cy.get('@colorAlias').should('equal', 'red');
    cy.then(() => {
        expect(this.colorAlias).to.eq('red');
    })
});