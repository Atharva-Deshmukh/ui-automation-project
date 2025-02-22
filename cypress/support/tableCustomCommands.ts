import { table } from "./ui-helpers/tableHelpers";

// Lots of chaining is required in cypress 
Cypress.Commands.add('getTableColumnIndex', (columnName) => {

    let columnIndex = -1;

    return table().find('th').should('be.visible').then(($headings) => {
        cy.wrap($headings).each(($heading, index) => {
            if ($heading.text().trim() === columnName) {
                columnIndex = index;
            }
        }).then(() => {
            // cypress don't return the value directly, hence need to wrap as object
            return cy.wrap({colIndex: columnIndex.toString()});
        });
    })
});

