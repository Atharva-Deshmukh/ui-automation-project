it('check if the given object is an array', () => {
    expect(Cypress._.isArray([1, 2, 3])).to.be.true;
});

it('check if the array is reversed', () => {
    let arr: number[] = [1, 2, 3];
    let reversedArr: number[] = Cypress._.reverse(arr);
    expect(reversedArr).to.deep.eq([3, 2, 1]);
});