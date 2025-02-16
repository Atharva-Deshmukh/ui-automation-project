/* There are two ways of drag and drop in cypress:

way-1: use cy.trigger(),
       But here, we need to keep track of various events 
       dragstart  on source
       dragend    on source
       dragleave  on target
       drop       on target

       also, need to manage event bubbline

way-2: use direct plugin:
https://github.com/4teamwork/cypress-drag-drop 

      This abstracts the inner working of events and also waits and retries whenever possible automatically
      Its more reliable


*/

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
});

it('Normal Plugin use - Without caring about the drop position', () => {
  cy.visit('https://qaboxletstestcypresspracticesite.netlify.app/dragndrop', {timeout: uiTimeout});
  cy.get('.fill').drag('div.empty:eq(2)');
    cy.get('div.empty:eq(2)').then(($ele) => {
      expect($ele.children('.fill')).to.exist;
    });

  cy.get('#divOne').drag('#divFour').then((resp => {
    expect(resp).to.be.true;  // denotes drag success!
  }));
});

/* During the drag and drop interaction, two elements are involved. The source element being 
dragged and the drop target. In order to decide what options should either be applied to the 
source or the target, the options object can be divided in source and target. 
Options that are not specific to the source or target are applied to both the source and the target.

cy.get('.sourceitem').drag('.target', {
  source: { x: 100, y: 100 }, // applies to the element being dragged
  target: { position: 'left' }, // applies to the drop target
  force: true, // applied to both the source and target element
})  */

it.only('Normal Plugin use - CARING about the drop position (DRAGGING EXACT CENTER)', () => {
  cy.visit('https://qaboxletstestcypresspracticesite.netlify.app/dragndropmouseevents', {timeout: uiTimeout});

  cy.get('#divTwo').drag('#divOne', {
    target: {position: 'center'},
    force: true
  }).then((resp => {
    expect(resp).to.be.true;  // denotes drag success!
  }));
});