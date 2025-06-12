/* 
TODO:
- upload download
- read write

There are two ways to UPLOAD file:

Way-1: Plugin => cypress-file-upload
Way-2: built in function, which is almost plugin like: selectFile()

                                                TARGET SUBJECT:
                                                ---------------
the subject must be a single input element with type="file", or a label element connected 
to an input (either with its for attribute or by containing the input).

                                                   EXAMPLES:
                                                   ---------

cy.get('input[type=file]').selectFile('file.json')
cy.get('input[type=file]').selectFile(['file.json', 'file2.json'])

cy.get('input[type=file]').selectFile({
  contents: Cypress.Buffer.from('file contents'),
  fileName: 'file.txt',
  mimeType: 'text/plain',
  lastModified: Date.now(),
})

cy.get('input[type=file]').selectFile('file.json', { action: 'drag-drop' })
cy.document().selectFile('file.json', { action: 'drag-drop' })

                                                    ON A HIDDEN INPUT
                                                    ----------------
cy.get('input[type=file]').selectFile('file.json', { force: true })
In many cases in modern applications, the underlying file input is hidden from view, 
and activated by a user clicking on a button. In these cases, you will need to tell Cypress 
to ignore its actionability checks and select the file even though a user would not be able 
to directly activate the file input.

]                                                    FROM A FIXTURE
                                                    ---------------
cy.fixture('file.json', null).as('myFixture')
cy.get('input[type=file]').selectFile('@myFixture')

Note the use of null encoding. By default, cy.fixture() and cy.readFile() attempt to 
interpret files read from disk, which would result in a JSON file being decoded and re-encoded 
as a utf-8 string - the contents would be preserved, but formatting would not be and the encoding 
might change. See cy.fixture or cy.readFile for more details on file encoding.


                                                    SELECTING MULTIPLE FILES
                                                    ------------------------
cy.get('input[type=file]').selectFile([
  'file1.json',
  'file2.json',
  'file3.json',
])

This will fail unless the file input has the multiple property.

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('File Uploads', () => {
    it('Image upload, click and close that overlay modal (gleb video)', () => {
        
        cy.fixture('FileUpload/TESTING TYPES.jpeg', null).as('imageAlias');
        
        // Everywhere this input is there, so just write it directly
        cy.visit('https://imgbb.com/', {timeout: uiTimeout});
        cy.get('input[type="file"]:first')
        .should('exist')
        .selectFile('@imageAlias', {force: true});

        cy.get('div[title="Remove"]', {timeout: uiTimeout})
        .should('be.visible');

        cy.get('div[data-action="edit"]:first', {timeout: uiTimeout})
        .should('be.visible').click('center');

        // Image now opens in an overlay covering entire frame in a separate iframe
        // .aut-iframe
        cy.then(() => {
            // we first access parent of iframe and then go inside that iframe
            cy.wrap(window.top.document.querySelector('.screenshot-height-container'))
            .should('be.visible')
            .find('.aut-iframe')  // get that iframe
            .its('0.contentDocument.body')
            .should('not.be.empty')
            .then(($ele) => {     // go inside that iframe
                cy.wrap($ele).get('body #fullscreen-modal #fullscreen-modal-box').find('.modal-box-title').should('have.text', 'Edit');
                cy.wrap($ele).get('body #fullscreen-modal #fullscreen-modal-box').find('.close-modal').click();
            });
        });

    });
});

describe('File Downloads', () => {
    it('', () => {

    });
});