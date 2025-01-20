describe('Get Cypress spec details', () => {

    // Cypress.spec returns you the properties of the spec under test.
   
    it('Get Cypress spec', () => {
        console.warn('SPEC OBJECT', Cypress.spec); 
        /*Info {
            absolute: "E:/CypressProject/ui-automation-project/cypress/e2e/cypress-apis/cypressSpec.cy.ts",
            baseName: "cypressSpec.cy.ts",
            fileExtension: ".ts",
            fileName: "cypressSpec",
            id: "U3BlYzpFOi9DeXByZXNzUHJvamVjdC91aS1hdXRvbWF0aW9uLXByb2plY3QvY3lwcmVzcy9lMmUvY3lwcmVzcy1hcGlzL2N5cHJlc3NTcGVjLmN5LnRz",
            name: "cypressSpec.cy.ts",
            relative: "cypress\\e2e\\cypress-apis\\cypressSpec.cy.ts",
            specFileExtension: ".cy.ts",
            specType: "integration"
            };*/
    });
});