import { commonTimeOut } from "../fixtures/commonData";

export const dashBoardFooter = () => cy.get('.oxd-layout-footer');

export function usingScrollTo() {
    cy.scrollTo('bottom');
    dashBoardFooter();
    cy.scrollTo('top');
}

export function usingScrollIntoView() {
    dashBoardFooter().scrollIntoView().should('be.visible');
}

export function tableScrollDown() {
    cy.waitUntil(() => cy.get('h1:contains("Automation Practice")').should('be.visible'), commonTimeOut);
    cy.scrollTo('bottom');
    cy.get('tbody').should('be.visible');
}
