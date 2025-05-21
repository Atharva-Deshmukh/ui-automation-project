import { uiTimeout } from "../../fixtures/commonData";

describe('Handling dropdowns in Cypress', () => {
    it.skip("Traditional Dropdowns with <select>", () => {
        cy.visit('https://www.zoho.com/commerce/free-demo.html', {timeout: uiTimeout}).then(() => {
            cy.get('h1:contains("Witness Zoho Commerce in action")', {timeout: uiTimeout}).should('be.visible');

            cy.get('#zcf_address_country', {timeout: uiTimeout})
            .should('be.visible')
            .should('have.value', 'India')  // checks the selected value
            .select('Zimbabwe')             // selects by value
            .should('have.value', 'Zimbabwe');
        });
    });

    it.skip("Bootstrap Dropdowns i.e. without <select>", () => {

        /* They don't have select tag, they have tags like span
           options are visible only on clicking the span

           in such dropdowns, there are <input> tags, so search elements by input tag
           And type
        */
        cy.visit('https://www.dummyticket.com/dummy-ticket-for-visa-application/', {timeout: uiTimeout}).then(() => {
            cy.get('p:contains("Dummy ticket booking")', {timeout: uiTimeout})
            .should('be.visible');

            // throught input
            cy.get('#select2-billing_country-container', {timeout: uiTimeout})
            .scrollIntoView()
            .should('be.visible')
            .should('have.text', 'India')
            .click()
            .then(() => {
                cy.get('input.select2-search__field')
                .should('be.visible')
                .type('Iran{enter}')
                .then(() => {
                    cy.get('#select2-billing_country-container', {timeout: uiTimeout})
                    .should('be.visible')
                    .and('have.text', 'Iran')
                });
            })

            // // through inspecting options and clicking on them directly, need to 
            // // use scroll sometimes, BUT IT NEEDS LOTS OF .then() CHAINING, NOT RECOMMENDED
            // cy.get('li.select2-results__option', {timeout: uiTimeout})
            // .should('be.visible')
            // .contains('Iran')
            // .click().then(() => {
            //     cy.get('span.select2-selection__rendered', {timeout: uiTimeout})
            //     .should('be.visible')
            //     .and('have.title', 'Iran')
            // });
        });
    });

    it("Autosuggest dropdowns", () => {

        /* like amazon or wikipedia sites, typing creates autosuggest lists on the go

            Test scenarios:
            - count no of autosuggestions coming
            - click on any autosuggestion, verify the page opened and go back again
        
        
        */

       // Scenario - 1
        // cy.visit('https://www.wikipedia.org/', {timeout: uiTimeout}).then(() => {
        //     cy.contains('Wikipedia').should('be.visible');
        //     let options = [];

        //     // simply inspect on the suggested options
        //     cy.get('input#searchInput', {timeout: uiTimeout})
        //     .type('united')
        //     .then(() => {
        //         cy.get('div.suggestions-dropdown a.suggestion-link', {timeout: uiTimeout})
        //         .should('be.visible')
        //         .each(($ele) => {
        //                 cy.wrap($ele).find('.suggestion-title')
        //                 .should('be.visible')
        //                 .invoke('text').then((text) => {
        //                     options.push(text.trim())
        //                 })
        //         }).then(() => {
        //             console.warn('OPTIONS -> ', options);
        //             expect(options).to.have.length.greaterThan(1);
        //         });
        //     });
        // });

        // Scenario - 2
        cy.visit('https://www.wikipedia.org/', {timeout: uiTimeout}).then(() => {
            cy.contains('Wikipedia').should('be.visible');
            let options = [];

            // simply inspect on the suggested options
            cy.get('input#searchInput', {timeout: uiTimeout})
            .type('united')
            .then(() => {
                cy.get('div.suggestions-dropdown a.suggestion-link', {timeout: uiTimeout})
                .should('be.visible')
                .find('.suggestion-title')
                .should('be.visible')
                .contains('United Arab Emirates')
                .click()
                .then(() => {
                    cy.url().should('match', /Emirates/ig);
                }).then(() => {
                    cy.go('back').then(() => {
                        cy.url().should('match', /wikipedia/ig);
                    })
                });
            });
        });
    });
});