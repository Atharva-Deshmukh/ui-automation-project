import {usingScrollTo, usingScrollIntoView, tableScrollDown } from "../../support/scrollWorkflow_helper";

describe('Workflow for exploring various scrolling functions default target site', {testIsolation: false}, () => {
    before('Login to target site', () => {
        cy.loginTargetSite(
            Cypress.env("TARGET_SITE"),
            Cypress.env("ADMIN_USERNAME"),
            Cypress.env("ADMIN_PASSWORD")
            );
    });

    it('Scroll the side bar to its bottom and verify the bottom most menu', () => {
       usingScrollTo();
    });

    it('Bring dashboard footer into view', () => {
        usingScrollIntoView();
    });

    after('Logout once done', () => {
        cy.logoutTargetSite();
    });


});