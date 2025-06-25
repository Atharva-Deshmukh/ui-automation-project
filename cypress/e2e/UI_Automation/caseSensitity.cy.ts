    it('Ignore case sensitivity', () => {

       cy.contains('TEXT', { matchCase: false }).type('some text!', { timeout: 0 });

    });