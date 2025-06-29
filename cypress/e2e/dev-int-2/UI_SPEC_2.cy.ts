it('TC - 1', () => {
  /*
    USERNAME: 'DEV_INT_2_USERNAME',
  PASSWORD: 'DEV_INT_2_PASSWORD',
  DIRECTORY: 'dev-int-2'
  */
  expect(Cypress.env('USERNAME')).to.equal('DEV_INT_2_USERNAME');
  expect(Cypress.env('PASSWORD')).to.equal('DEV_INT_2_PASSWORD');
  expect(Cypress.env('DIRECTORY')).to.equal('dev-int-2');
});