/*
before(() => {
  // root-level hook
  // runs once before all tests
})

beforeEach(() => {
  // root-level hook
  // runs before every test block
})

afterEach(() => {
  // runs after each test block
})

after(() => {
  // runs once all tests are done
})

Tags:
.only: multiple only tags can be there in the suite
.skip
*/

describe('Hooks And Tags', () => {

  before(() => {
    cy.log('BEFORE HOOK');
  });
  
  after(() => {
    cy.log('AFTER HOOK');
  });
  
  beforeEach(() => {
    cy.log('BEFORE EACH HOOK');
  });

  afterEach(() => {
    cy.log('AFTER EACH HOOK');
  });

  it('It block', () => {
    cy.log('Test - 1');
  });

  it.only('It block', () => {
    cy.log('Test - 2');
  });

  it.only('It block', () => {
    cy.log('Test - 3');
  });

  it('It block', () => {
    cy.log('Test - 4');
  });
});