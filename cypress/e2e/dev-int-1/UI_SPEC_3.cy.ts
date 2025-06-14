it('Passing test intentionally', () => {
    expect(true).to.equal(true);
});

it('Failing test intentionally', () => {
    expect(true).to.equal(false);
});

afterEach(function() {
    if(this.currentTest.state === 'failed') {
        cy.wait(10000); // Wait for 10 seconds to capture extended video
    }
});