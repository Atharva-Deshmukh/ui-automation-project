/* Cypress by default fails the request that gives status requests other than
2xx or 3xx
Hence we are not able to add assertions over them
To pass these requests and execute our assertion, we use failOnStatusCode: false */

it('WITHOUT failOnStatusCode', () => {
    cy.request({
        method: 'GET',
        url: 'https://reqres.in/api/unknown/23'  // URL gives 404
    }).then((resp) => {
        expect(resp.status).to.equal(404);  // WE WON'T reach here in the first place, since we 
    });

    /* ERROR Issued:

    cy.request() failed on:

https://reqres.in/api/unknown/23

The response we received from your web server was:

> 404: Not Found

This was considered a failure because the status code was not 2xx or 3xx.

If you do not want status codes to cause failures pass the option: failOnStatusCode: false*/
});

it.only('WITH failOnStatusCode', () => {
    cy.request({
        method: 'GET',
        url: 'https://reqres.in/api/unknown/23' , // URL gives 404
        failOnStatusCode: false,
    }).then((resp) => {
        expect(resp.status).to.equal(404);  // Now we will reach here
    });
});