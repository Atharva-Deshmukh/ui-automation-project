/* There are two ways of drag and drop in cypress:

way-1: use cy.trigger()

way-2: use direct plugin:
https://github.com/4teamwork/cypress-drag-drop */

import { uiTimeout } from "../../fixtures/commonData";

let dragNDropURL: string = "https://demo.automationtesting.in/Static.html";
let targetId: string = '#droparea';
let sourceId: string = '#node';
let isTargetVisible = () => cy.get('#droparea', {timeout: uiTimeout}).should('be.visible');
let isSourceVisible = () => cy.get('#node', {timeout: uiTimeout}).should('be.visible');

describe('Drag and drop in cypress', () => {
    beforeEach('Login to the page', () => {
        cy.visit(dragNDropURL, {timeout: 10000});
        cy.url().then((url) => {
            expect(url).to.include('demo.automationtesting');
            isTargetVisible();
            isSourceVisible();
        });
    });

    it('Using plugin', () => {
        cy.get(sourceId, { timeout: uiTimeout }).drag(targetId);
          
        
          // Verify if the source element is successfully dropped
          isTargetVisible().then(($target) => {
            expect($target.find(sourceId)).to.exist;  // Finds all, children grandchildren...
            expect($target.children(sourceId)).to.exist; // Look directly for the children
          });

        // cy.get(sourceId).move({ deltaX: 800, deltaY: -10 }); // can use this also
    });

    // it('Without plugin', () => {

    // });

});