describe('Two ways for conditional testing in cypress', () => {
    it('WAY-1: Less reliable', () => {
        cy.get('body', {timeout: 50000})
        .should('be.visible')
        .then(($body) => {
            if($body.find('locator of that element').length > 0) {
                // element exists, do something
            }

            // This way is sometimes not reliable as sometimes DOM elements still have some length
        });
    });

    it('WAY-2: More reliable', () => {
        cy.get('body', {timeout: 50000})
        .should('be.visible')
        .then(($body) => {
            if($body.find('locator of that element').is(':visible')) {
                // element exists, do something
            }
            
            // can be written in negative way also
            if($body.find('locator of that element').not(':visible')) {
                // element DO NOT exist, do something
            }
        });
    });
});