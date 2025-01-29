import { inRange } from "cypress/types/lodash";
import { uiTimeout } from "../../fixtures/commonData";

/* What is an Iframe?

  An inline frame (iframe) is a HTML element that loads another HTML page within the document. 
  It essentially puts another webpage within the parent page. They are commonly used for advertisements, 
  embedded videos, web analytics and interactive content. 
  
  we have something like 

  <iframe...>
   #document
    <ul>
    .
    .

   Although, locator of iframe is visible direclty by cy.get(), 
   we cannot get the elements inside iframe directly using cy.get()

  */

describe('HANDLING IFRAMES', () => {

    /* Get the iframe locator and then find the desired element inside the iframe*/

    describe('Way-1: Through code', () => {
        it("Click on change theme button inside an iframe", () => {
            cy.visit('https://practice-automation.com/iframes/').then(() => {
                cy.get('h1:contains("Iframes")', {timeout: uiTimeout}).should('be.visible');
            });
    
            // This fails since we cannot access elements directly for an iframe
            // cy.get('#iframe-1', {timeout: uiTimeout}).find('title:contains("Actions | Playwright")').should('be.visible');
            
            // this code is a workaround for all iframe manipulation
            cy.get('#iframe-1', { timeout: uiTimeout })
            .its('0.contentDocument.body').should('not.be.empty')
            .then(($ele) => {
                cy.wrap($ele).find('nav[aria-label="Main"] .toggle_vylO.colorModeToggle_DEke').find('button:first').should('be.visible').click().then(() => {
                    cy.root().should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
                });
            });
        });
    });

    describe('Way-2: Using plugin', () => {

        /* cypress-iframe: yarn add -D cypress-iframe


        You can now use the three included commands.

        frameLoaded: This command checks that an iframe has loaded onto the page

        // This will verify that the iframe is loaded to any page other than 'about:blank'
        cy.frameLoaded()
        
        // This will verify that the iframe is loaded to any url containing the given path part
        cy.frameLoaded({ url: 'https://google.com' })
        cy.frameLoaded({ url: '/join' })
        cy.frameLoaded({ url: '?some=query' })
        cy.frameLoaded({ url: '#/hash/path' })
        
        // You can also give it a selector to check that a specific iframe has loaded
        cy.frameLoaded('#my-frame')
        cy.frameLoaded('#my-frame', { url: '/join' })

        iframe
        This will cause subsequent commands to be executed inside of the given iframe

        // This will verify that the iframe is loaded to any page other than 'about:blank'
        cy.iframe().find('.some-button').should('be.visible').click()
        cy.iframe().contains('Some hidden element').should('not.be.visible')
        cy.find('#outside-iframe').click() // this will be executed outside the iframe
        
        // You can also give it a selector to find elements inside of a specific iframe
        cy.iframe('#my-frame').find('.some-button').should('be.visible').click()
        cy.iframe('#my-second-frame').contains('Some hidden element').should('not.be.visible')

        enter
        This can be used to execute a group of commands within an iframe

        // This will verify that the iframe is loaded to any page other than 'about:blank'
        cy.enter().then(getBody => {
        getBody().find('.some-button').should('be.visible').click()
        getBody().contains('Some hidden element').should('not.be.visible')
        })
        
        // You can also give it a selector to find elements inside of a specific iframe
        cy.enter('#my-iframe').then(getBody => {
        getBody().find('.some-button').should('be.visible').click()
        getBody().contains('Some hidden element').should('not.be.visible')
        })

        */

        it("Way-2: Plugin solution", () => {
            cy.reload();
            cy.visit('https://practice-automation.com/iframes/').then(() => {
                cy.get('h1:contains("Iframes")', {timeout: uiTimeout}).should('be.visible');
            });

            cy.frameLoaded('#iframe-1');
            cy.iframe('#iframe-1').find('nav[aria-label="Main"] .toggle_vylO.colorModeToggle_DEke').find('button:first').should('be.visible').click().then(() => {
                cy.root().should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
            });
        });
    });
})