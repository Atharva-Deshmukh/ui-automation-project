import { uiTimeout } from "../../fixtures/commonData";

let isTargetVisible = () => cy.get('#droparea', {timeout: uiTimeout}).should('be.visible');

describe('Cypress web navigation suites', () => {

    /* cy.visit():

    
    
    */

    it('cy.visit() test suite', () => {
        
    });

    // it('cy.url() test suite', () => {
        
    // });

});