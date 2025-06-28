/*  Yields 
- cy.origin() yields the value yielded by the last Cypress command in the callback function.
- If the callback contains no Cypress commands, cy.origin() yields the return value of the function.
- In either of the two cases above, if the value is not serializable, attempting to access the yielded 
  value will throw an error. */


/* Cypress 13+ supports cross-origin navigation and testing out of the box for most use cases, 
so your test works without a cross-origin error even without using `cy.origin()`.

Cypress automatically handles the context switch between origins for supported commands. */
const uiTimeout: number = 10000;
it('Without cy.origin() works for V 13+', () => {
    cy.visit('https://practice-automation.com/', {timeout: uiTimeout});

    cy.contains('Welcome to your software automation practice website! ', {timeout: uiTimeout})
    .should('be.visible');

    /* Visiting other domain */
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {timeout: uiTimeout})
    .then(() => {
        cy.get('input[name="username"]', {timeout: uiTimeout}).should('be.visible').type('Admin');
        cy.get('input[name="password"]', {timeout: uiTimeout}).should('be.visible').type('admin123');
        cy.get('button[type="submit"]', {timeout: uiTimeout}).should('be.visible').click();
    });
});

/* It is very important to understand that variables inside the callback are 
not shared with the scope outside the callback. 
the variable must be explicitly passed into the callback using the args option in cy.origin()

Don't pass entire URL in cy.origin() as it will not work.
You can only pass the domain name, like 'https://example.com' or 'example.com'.
This is because cy.origin() is designed to switch the context to a different origin,
Not to navigate to a specific URL.

After cy.orgin() shifts the context to the specified origin,
you can use cy.visit('/') to navigate to a specific URL within that origin.
This is the baseUrl WITHING THAT CONTEXT. */

it('Cross Origin Test', () => {
    cy.visit('https://practice-automation.com/', { timeout: uiTimeout });

    cy.contains('Welcome to your software automation practice website! ', { timeout: uiTimeout })
    .should('be.visible');

    cy.then(() => {
        Cypress.session.clearAllSavedSessions();
        Cypress.session.clearCurrentSessionData();
    });

    /* Visiting other domain */
    const userName: string = 'Admin';
    const password: string = 'admin123';
    cy.origin(
        'https://opensource-demo.orangehrmlive.com',
        { args: { userName, password, uiTimeout } },
        ({ userName, password, uiTimeout }) => {
            cy.visit('/web/index.php/auth/login', { timeout: uiTimeout });
            cy.get('input[name="username"]', { timeout: uiTimeout }).should('be.visible').type(userName);
            cy.get('input[name="password"]', { timeout: uiTimeout }).should('be.visible').type(password);
            cy.get('button[type="submit"]', { timeout: uiTimeout }).should('be.visible').click();
        }
    );
});

it('Lots of multi domains', () => {
    cy.visit('https://practice-automation.com/', {timeout: uiTimeout});

    cy.contains('Welcome to your software automation practice website! ', {timeout: uiTimeout})
    .should('be.visible');

    cy.visit('https://docs.cypress.io/api/commands/hash', {timeout: uiTimeout})
    .then(() => {
        cy.contains('hash', {timeout: uiTimeout}).should('be.visible');
    });

    cy.visit('https://graphql.org/', {timeout: uiTimeout})
    .then(() => {
        cy.contains('GraphQL', {timeout: uiTimeout}).should('be.visible');
    });

});

it('Lots of multi domains - with cy.origin()', () => {

    cy.origin('https://practice-automation.com', {args: {uiTimeout}}, ({uiTimeout}) => {
        cy.visit('/', {timeout: uiTimeout});
        cy.contains('Welcome to your software automation practice website! ', { timeout: uiTimeout })
        .should('be.visible');
    });

    cy.origin('https://docs.cypress.io/api/commands/hash', {args: {uiTimeout}}, ({uiTimeout}) => {
        cy.visit('/', {timeout: uiTimeout});
        cy.get('h1:contains("hash")', {timeout: uiTimeout}).should('be.visible');
    });

    cy.origin('https://graphql.org/', {args: {uiTimeout}}, ({uiTimeout}) => {
        cy.visit('/', {timeout: uiTimeout});
        cy.contains('GraphQL', {timeout: uiTimeout}).should('be.visible');
    });
});

beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    Cypress.session.clearCurrentSessionData();
    Cypress.LocalStorage.clear();
    cy.clearCookies();
});