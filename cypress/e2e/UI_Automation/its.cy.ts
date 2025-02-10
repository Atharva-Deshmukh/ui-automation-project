describe('its in cypress', () => {
   
    // Get a property's value on the previously yielded subject.
    it('its in cypress', () => {
        cy.wrap({ width: '50' }).its('width').should('eq', '50'); // Get the 'width' property
        cy.wrap(['Wai Yan', 'Yu']).its(1).should('eq', 'Yu'); // true

        cy.visit('https://www.automationexercise.com/', {timeout: 50000});
        cy.title().its('length').should('eq', 19);

        const fn = () => {
            return 42
          }
          
          // function
          cy.wrap({ getNum: fn }).its('getNum').should('be.a', 'function');

          // nested property
          const user = {
            contacts: {
              work: {
                name: 'Kamil',
              },
            },
          }
          
          cy.wrap(user).its('contacts.work.name').should('eq', 'Kamil'); // true

          // check if something does not exist
          cy.window().its('evilProp').should('not.exist');
    });
});
