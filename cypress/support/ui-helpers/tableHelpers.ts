import { uiTimeout } from "../../fixtures/commonData";

export const table = () => cy.get('table#productTable', {timeout: uiTimeout}).should('be.visible');

export function getTableColumnIndex(columnName: string): Cypress.Chainable<any> {
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

    });
}