/* When some locator changes, we need to make changes everywhere it is used
So, this is tedious

WORKAROUNDS:

- Declare a global locator in helper file and call it
- Alias the locator and then call it


cy.get('target').as('targetAlias');
cy.get('@targetAlias').find(..)

*/