
import { uiTimeout } from "../../fixtures/commonData";

/* For .check()
This element must be an <input> with type checkbox or radio.

There are three states of checkboxes:
- checked:            [✔]
- unchecked:          [ ]
- indeterminate:      [-]  

typically used in "Select All" scenarios where some but not all child checkboxes are selected.
The indeterminate state is visual only. The checkbox is still either checked or unchecked as a state. 
That means the visual indeterminate state masks the real value of the checkbox, 
so that better make sense in your UI!
Like the checkboxes themselves, indeterminate state looks different in different browsers.

You can’t make a checkbox indeterminate through HTML. 
There is no indeterminate attribute. It is a property of checkboxes though, which you can change via JS.

var checkbox = document.getElementById("some-checkbox");
checkbox.indeterminate = true;

            u can verify it:
            and('have.prop', 'indeterminate', true)

            u can set it:
            invoke('prop', 'indeterminate', true)
*/

describe('Radio Buttons and Checkboxes in cypress', () => {
    it('Radio Buttons ', () => {

        cy.visit('https://practice.expandtesting.com/radio-buttons', {timeout: uiTimeout});
        cy.get('input[type="radio"]#blue', {timeout: uiTimeout})
        .should('be.visible')
        .and('not.be.disabled');
        
        cy.get('input[type="radio"]#blue', {timeout: uiTimeout})
        .check()
        .should('be.checked');

        /* CANNOT CALL UNCHECK ON RADIO BUTTON, CAN ONLY BE CALLED ON CHECKBOX
              .uncheck()
        .should('not.be.checked');
        */
        
        cy.get('input[type="radio"]#red', {timeout: uiTimeout})
        .should('not.be.checked');

        // checking for the disabled radio button
        cy.get('input[type="radio"]#green', {timeout: uiTimeout})
        .should('be.visible')
        .and('be.disabled');


    });

    it('Checking a SINGLE CheckBox', () => {

        cy.visit('https://practice.expandtesting.com/checkboxes', {timeout: uiTimeout});

        /* DOM
        
            label - checkbox
            label - checkbox
            label - checkbox */
        
        cy.get('label[for="checkbox1"]', {timeout: uiTimeout})
        .should('be.visible')
        .parent()
        .find('input#checkbox1')
        .should('be.visible')
        .and('not.be.checked')
        .check()
        .should('be.checked')
        .uncheck()
        .should('not.be.checked');

        // unchecking an already uncecked checkbox - IT WORKS!!
        cy.get('label[for="checkbox1"]', {timeout: uiTimeout})
        .should('be.visible')
        .parent()
        .find('input#checkbox1')
        .should('be.visible')
        .and('not.be.checked')
        .uncheck()
        .should('not.be.checked');

    });

    it('Checking MULTIPLE CheckBoxes ', () => {

        cy.visit('https://practice.expandtesting.com/checkboxes', {timeout: uiTimeout});

        /* DOM
        
            label - checkbox
            label - checkbox
            label - checkbox */
        

        // write a selector that selects all checkboxes at a time and then use check()
        // we can also assert multiple checks at a time
        
        cy.get('input.form-check-input', {timeout: uiTimeout})
        .check()
        .should('be.checked')
        .uncheck()
        .should('not.be.checked');

    });

    /*                  CHALLENGES: Gleb bahmutav 
                                DOM USED:

    <body>
        <input type="checkbox" id="option1" checked>
        <label for="option1">Option 1</label>
        <br>

        <input type="checkbox" id="option2" value="opt2">
        <label for="option2">Option 2</label>
        <br>

        <input type="checkbox" id="option3" checked>
        <label for="option3">Option 3</label>
        <br>

        <input type="checkbox" id="option4" value="opt4">
        <label for="option4">Option 4</label>
        <br>

        <input type="checkbox" id="option5">
        <label for="option5">Option 5</label>
    </body>

*/
    it('get labels of all checkboxes', () => {

        cy.visit('http://127.0.0.1:5500/DOMs/Checkboxes.html', {timeout: uiTimeout})

        cy.get('input[type=checkbox] ~ label', {timeout: uiTimeout})
        .should('be.visible')
        .each(($ele) => {
            cy.log('Label -> ', $ele.text());
        })
    });

    it('get labels of all CHECKED checkboxes', () => {

        cy.visit('http://127.0.0.1:5500/DOMs/Checkboxes.html', {timeout: uiTimeout});

        cy.get('input[type=checkbox]', {timeout: uiTimeout})
        .filter(':checked')
        .next('label')
        .should('be.visible')
        .each(($ele) => {
            cy.log('Label -> ', $ele.text());
        })
        // cy.get('input[type=checkbox]:checked ~ label', {timeout: uiTimeout})
        // .should('be.visible')
        // .each(($ele) => {
        //     cy.log('Label -> ', $ele.text());
        // })
    });

    it('get the Ids of checkboxes unchecked and check them and verify', () => {
        let uncheckedIds = [];

        cy.visit('http://127.0.0.1:5500/DOMs/Checkboxes.html', {timeout: uiTimeout});

        cy.get('input[type=checkbox]', {timeout: uiTimeout})
        .not(':checked')
        .should('be.visible')
        .each(($ele) => {
            uncheckedIds.push($ele.attr('id'));
        })

        cy.wrap(uncheckedIds).should('deep.equal', ['option2', 'option4', 'option5']);
    });

    it.only('Check multiple checkboxes based on their IDs and Values', () => {

        cy.visit('http://127.0.0.1:5500/DOMs/Checkboxes.html', {timeout: uiTimeout});

        // check([valueArr]), not anything else
        cy.get('input[type=checkbox]', {timeout: uiTimeout})
        .should('be.visible')
        .check(['#option2', '#option4']);  // doesn't work, need to pass only values[] in check()

        cy.get('input[type=checkbox]', {timeout: uiTimeout})
        .should('be.visible')
        .check(['opt2', 'opt4'])  // it works
        .and('be.checked');
    });

    it('Check checkboxes with state = selected (have few selected and unselected checkboxes first)', () => {

    });
});