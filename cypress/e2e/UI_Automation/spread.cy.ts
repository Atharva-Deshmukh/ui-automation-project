/* spread
Expand an array into multiple arguments.
Identical to .then(), but always expects an array-like structure as its subject.
.spread() yields the return value of your callback function.

Ex: 

cy.intercept('/users/*').as('getUsers')
cy.intercept('/activities/*').as('getActivities')
cy.intercept('/comments/*').as('getComments')

cy.wait(['@getUsers', '@getActivities', '@getComments']).spread(
  (getUsers, getActivities, getComments) => {
    // each interception is now an individual argument
  }
)

*/
describe('Spread Workflow', () => {   
    it('Spread Workflow', () => {
        cy.wrap([2,3,6]).spread((arg1, arg2, arg3) => {
          expect(arg1 + arg2 + arg3).to.eq(11);
        });
    });
    it('Spread Workflow', () => {
        cy.wrap([2,3,6]).spread((arg1, arg2) => {
            expect(arg1 + arg2).to.eq(5);
        });
    });
});
