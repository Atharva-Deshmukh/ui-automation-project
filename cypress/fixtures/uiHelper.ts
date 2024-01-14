export const loadingSymbol = () => cy.get('.oxd-loading-spinner');

export function verifyLoadingSymbol() {
    loadingSymbol().should('not.exist');
}