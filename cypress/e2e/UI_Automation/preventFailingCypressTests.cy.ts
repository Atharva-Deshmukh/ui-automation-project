// We can directly use  plugin but we need to know these both manual steps

it('Scenario 1: Prevent failing test cases in case of DOM errors', () => {

    /* Add this to e2e.ts file, and test will never fail at all!

        Cypress.on('uncaught:exception', (err, runnable) => {
            return false; // prevent test from failing
        }); */

    cy.visit('http://127.0.0.1:5500/DOMs/ERROR_DOM.html', {timeout: 40000}).then(() => {

        /* DOM:
            <body>

                <p>I am in DOM</p>

                <script>
                    console.log('LOG');
                    console.log('LOG ANOTHER');
                    console.error('LOGGED ERROR ON CONSOLE');
                    nonExistentObj.y;  // this is issue and we need to pass here
                </script>
        
            </body>  */

        cy.log('Line 1');
        cy.log('Line 2');
        cy.log('Line 3');
    });

    /* If the spec file or any cypress file has error, then uncaught:exception cannot catch it
    and test fails, ex: comment below.

    uncaught:exception is only for DOM side errors. */

    // nonExistentObject.y  // error -> ReferenceError nonExistentObject is not defined

});

it('Scenario 2: Fail test cases whenever there are any console.error(), uncaught:exception passes the test in that case', () => {

    /* In production code, we generally don't see console.error(), in order to fail our test
       when we see one, do the following steps: 
    
        Step- 1: First comment this out in e2e.ts, since now we want to fail test cases on any console logs

            Cypress.on('uncaught:exception', (err, runnable) => {
                return false; // prevent test from failing
            });

        Step - 2: Write this now in e2e.ts

            Cypress.on('window:before:load', (winObj) => {
                cy.stub(winObj.console, 'log').callsFake((msg) => {
                    cy.now('task', 'log', msg);   // prints error on terminal/console
                    throw new Error(msg);
                });
                cy.stub(winObj.console, 'error').callsFake((msg) => {
                    cy.now('task', 'error', msg);
                    throw new Error(msg);
                });
            }); */

    cy.visit('http://127.0.0.1:5500/DOMs/ERROR_DOM.html', {timeout: 40000}).then(() => {

                /* DOM:
            <body>

                <p>I am in DOM</p>

                <script>
                    console.log('LOG');
                    console.log('LOG ANOTHER');
                    console.error('LOGGED ERROR ON CONSOLE');
                </script>
        
            </body>  */

        cy.log('Line 1');
        cy.log('Line 2');
        cy.log('Line 3');
    });
});