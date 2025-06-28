/* Any key/value you set in your Cypress configuration under the env key 
   will become an environment variable. 

export default defineConfig({
  projectId: '128076ed-9868-4e98-9cef-98dd8b705d75',
  env: {
    login_url: '/login',
    products_url: '/products',
  },
}) 
  
Use this when its safe to store sensitive data in the config file.
Since this will be committed to the repository. */
it('Way - 1: config file', () => {
    expect(Cypress.env('AD_TEST')).to.equal('CONFIG_VAR');
});

/* This is very secure way to store environment variables.

You can create your own cypress.env.json file that Cypress will automatically check. 
Values in here will overwrite conflicting environment variables in your Cypress configuration.

This strategy is useful because if you add cypress.env.json to your .gitignore file, 
the values in here can be different for each developer machine. */
it('Way - 2: cypress.env.json file', () => {
    expect(Cypress.env('ADMIN_PASSWORD')).to.equal("admin123");
});

/* Any exported environment variables set on the command line or in your CI provider that start with either 
CYPRESS_ or cypress_ will automatically be parsed by Cypress.
The environment variable CYPRESS_INTERNAL_ENV is reserved and should not be set. 

Command used in git bash: export CYPRESS_ADMIN_PASSWORD="exported" && yarn run cypress open
Command used in PowerShell: $env:CYPRESS_ADMIN_PASSWORD="exported"; yarn run cypress open
*/
it('Way - 3: CYPRESS_*', () => {
    expect(Cypress.env('ADMIN_PASSWORD')).to.equal("exported");
});

/* Valid only for cypress run command.

Command used in git bash:
yarn run cypress run --env ADMIN_PASSWORD=exported_from_bash --spec=cypress/e2e/UI_Automation/environmentVariables.cy.ts  */
it('Way - 4: --env', () => {
    expect(Cypress.env('ADMIN_PASSWORD')).to.equal("exported_from_bash");
});

it.only('Way - 5: Test Configuration', { env: { ADMIN_PASSWORD: "FROM_TEST_CONFIGURATION" } }, () => {
    expect(Cypress.env('ADMIN_PASSWORD')).to.equal("FROM_TEST_CONFIGURATION");
});