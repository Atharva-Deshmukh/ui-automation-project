it('TC - 1', () => {
  /*
    USERNAME: 'DEV_INT_1_USERNAME',
  PASSWORD: 'DEV_INT_1_PASSWORD',
  DIRECTORY: 'dev-int-1'
  */
  expect(Cypress.env('USERNAME')).to.equal('DEV_INT_1_USERNAME');
  expect(Cypress.env('PASSWORD')).to.equal('DEV_INT_1_PASSWORD');
  expect(Cypress.env('DIRECTORY')).to.equal('dev-int-1');
});