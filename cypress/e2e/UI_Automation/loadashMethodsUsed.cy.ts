it('check if the given object is an array', () => {
    expect(Cypress._.isArray([1, 2, 3])).to.be.true;
});

it('check if the array is reversed', () => {
    let arr: number[] = [1, 2, 3];
    let reversedArr: number[] = Cypress._.reverse(arr);
    expect(reversedArr).to.deep.eq([3, 2, 1]);
});

describe('Loadash Loop', () => {
    Cypress._.times(5, (i) => {
        it(`Loadash Loop. Iteration - ${i}`, () => {
            cy.log('-----ITERATION-----');
        });
    });

    /*
    Loadash Loop
        Loadash Loop. Iteration - 0
        log-----ITERATION-----

        Loadash Loop. Iteration - 1

        log-----ITERATION-----
        Loadash Loop. Iteration - 2

        log-----ITERATION-----
        Loadash Loop. Iteration - 3

        log-----ITERATION-----
        Loadash Loop. Iteration - 4

        log-----ITERATION-----
    */
});