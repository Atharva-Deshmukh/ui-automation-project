/*

*/

import { uiTimeout } from "../../fixtures/commonData";
import { table, getTableColumnIndex } from "../../support/ui-helpers/tableHelpers";

let priceIndex: string;
let checkBoxIndex: string;
let nameIndex: string;

const previousButton = () =>  cy.get('.pagination a:contains("Previous")', {timeout: uiTimeout}).should('be.visible');
const currentBar = () =>  cy.get('.pagination li.current', {timeout: uiTimeout}).should('be.visible');
const nextButton = () =>  cy.get('.pagination a:contains("Next")', {timeout: uiTimeout}).should('be.visible');

describe('WORKFLOWS', () => {

    before(() => {
        cy.visit('https://testautomationpractice.blogspot.com/', {timeout: uiTimeout});
        table();

        // filling data in before hook to maintain sync
        cy.getTableColumnIndex('Name').then((obj) => {
            nameIndex = obj.colIndex
            cy.log('Name index  ' + nameIndex)
        });
        cy.getTableColumnIndex('Select').then((obj) => {
            checkBoxIndex = obj.colIndex
            cy.log('Checkbox Index ' + checkBoxIndex)
        });
        cy.getTableColumnIndex('Price').then((obj) => {
            priceIndex = obj.colIndex
            cy.log('Price Index  ' + priceIndex)
        });
    });

    it('Count no of rows and columns per page in table', () => {
        table().scrollIntoView().find('th').then(($headings) => {
            cy.log(`Columns -> ${$headings.length}`);
        });

        table().scrollIntoView().find('tbody tr').then(($rows) => {
            cy.log(`rows -> ${$rows.length}`);
        });
    });

    it('Accessing particular data: get the price of the smartwatch from its row and select checkbox in that row', () => {
        
        // cy.get('table#productTable tr td:contains("Smartwatch")')
        table().scrollIntoView().find(`tr td:contains("Smartwatch")`)
        .should('be.visible')
        .parent().find(`td:eq(${checkBoxIndex}) input`).click();

    });

    it('Read all cells in the first page of table pagination', () => {
        
        // cy.get('table#productTable tr td:contains("Smartwatch")')
        table().scrollIntoView().find(`tbody tr`).each(($row, rowNum) => {
            cy.log(' ----------- ');
            cy.wrap($row).find('td').each(($cellEle, colNum) => {
                // CONDITIONAL Testing: if cell has checkbox, log checkbox
                cy.wrap($cellEle).then(($cellEleData) => {
                    if($cellEleData.find('input').length > 0) {
                        cy.log(`row - ${rowNum} || cellContent - CHECKBOX`);
                    }
                    else cy.log(`row - ${rowNum} || cellContent - ${$cellEle.text().trim()}`);
                });
            });
        });

    });
});

it.only('Pagination', () => {

    /*   If we have a table like this

    | 3 | 7 | 2 |
    | 5 | 1 | 9 |
    | 8 | 4 | 6 |
    | 2 | 3 | 7 |
                1 - 4 rows out of 36 (3 pages)

    We first need to get total pages 
    we will get this from this string  ("1 - 4 rows out of 36 (3 pages)")
    No of pages = after '(' and before "pages"

    // EXTRACTING TOTAL PAGES
    s.substring(s.indexOf("(") + 1, s.indexOf("pages") - 1)

    In our automation, we will be using a different site:
     https://computer-database.gatling.io/computers

    here string = Displaying 1 to 10 of 574, we will will split(' ')[lastOne] to get totalPages

    WORKFLOW: 
    - click next 3 times to load 3rd page, now previous is enabled
    - click prev until it is disabled (to ensure we are on very first page)
    - Print all the values of the table
    
    */

    cy.visit('https://computer-database.gatling.io/computers', {timeout: uiTimeout});

    // extract the total no of pages - text present: Displaying 1 to 10 of 574
    currentBar().then(($ele) => {
        let splittedArr = $ele.text().split(' ');
        cy.log('Total Pages = ' + splittedArr[splittedArr.length - 1]);
    });

    // previous button is disabled initially
    previousButton().scrollIntoView().parent().should('have.class', 'disabled');

    // click next three times 
    Cypress._.times(3, (i) => {
        nextButton().click();
        cy.get('td').should('be.visible')
    });

    // Now click the previous button untill it disappears - USING RECURSION

    // selector: a:contains("Previous")

    function clickUntilEnabled(buttonSelector) {

        cy.get('td').should('be.visible');

        // use conditional testing via parent element
        cy.get('.pagination', {timeout: uiTimeout})
        .should('be.visible')
        .then(($parent) => {
            // disabled nahi to click
            if(!$parent.find(buttonSelector).parent().hasClass('disabled')) {
                cy.wrap($parent).find(buttonSelector).click();
                clickUntilEnabled(buttonSelector);
            }
            // disabled hai to stop
            else {
                expect($parent.find(buttonSelector)).to.have.class('disabled');
            }   
        })

    }

      // Usage:
      clickUntilEnabled('a:contains("Previous")');
      




   


});