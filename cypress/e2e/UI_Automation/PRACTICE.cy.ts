describe('each() and then()', () => {   
    it('each() loads everything in the queue before starting iteration', () => {
        cy.wrap([1, 2, 3, 4, 5, 6]).each(($ele, index) => {
            cy.wait(1000); // Add delay to show sequential behavior
            console.log('');
            console.warn('ELEMENT -> ' + $ele);
            console.warn('INDEX -> ' + index);
        });
    });
});