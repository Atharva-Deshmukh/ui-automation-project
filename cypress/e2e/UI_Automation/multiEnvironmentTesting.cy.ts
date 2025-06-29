/* There are two ways for multi env testing in Cypress:
   1. env.json file for separate environment variables, but this is recommended only for small projects.
   2. Separate config files for each environment, which is recommended for large projects.

   In Siemens project, we are a slightly different way, 
   where we use switch case to create a config object based on the environment variable exported from node.*/
describe('Testing in different environments', () => {

    it('Exporting variables in node environments', () => {
        /* Cypress exposes environment variables to your test code via Cypress.env('VAR_NAME') 
        
           Command used in git bash:
           export NODE_VAR="exported_from_node" && NODE_VAR_2="new_val" &&  yarn run cypress open        
        */
        expect(Cypress.env('NODE_VAR')).to.equal('exported_from_node');
        expect(Cypress.env('NODE_VAR_2')).to.equal('new_val');
    });
});

/* Use Command in git bash:
export ENV_1_OR_ENV_2="ENV2" && yarn run cypress open --config-file=multi_env_config.ts --config specPattern="cypress/e2e/dev-int-2/*.cy.ts" 

Created a separate config file for multi environment testing,
where we can switch between different environments based on the environment variable passed from node.

*/

