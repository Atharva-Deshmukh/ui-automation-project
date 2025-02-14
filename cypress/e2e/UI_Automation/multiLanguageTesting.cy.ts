import { uiTimeout } from "../../fixtures/commonData";

describe('WORKFLOW', () => {
    // Google injects security puzzles challenges so cypress url mostly cannot navigate when URL has queryParams
    // , hence chromeWebSecurity: false, but it don't Guarantee success. use cy.request() instead.
    // cy.visit() expects response data in text/html format
    // but URLs like this: https://jsonplaceholder.typicode.com/posts?userId=1&_limit=5&_sort=id
    // Gives data in application/json FORMAT
    it('JUST A demo to extract queryParams from URL in case language testing is based on query params', () => {
        cy.visit('https://www.google.com/search?q=cypress+testing&hl=en&num=10', {timeout: 60000}).then(() => {
            cy.location('search').then((data) => {
                console.warn('QUERY PARAMS -> ', data)
            })
        })
    });

    /* Test Workflow:
       on the site we will visit, the language change will be denoted by /lang/ like thing in URL
       the baseURL is same
       for each language wise page, there is a locator changing in bottom right as per the language 
       
       URLs changing as follows:
                // https://www.apple.com/ae/
                // https://www.apple.com/ca/
                // https://www.apple.com/in/


       Custom command writtern:
       Cypress.Commands.add('languageWiseStrings', (languageEndpoint) => {
            switch(languageEndpoint) {
                case 'in': return "India";
                case 'ae': return "United Arab Emirates";
                case 'ca': return "Canada (English)";
            }
        });  
        
        languageWiseStrings(languageEndpoint: string): Chainable<string>;
        */
    
    it.only('Visit various URLs and assert language wise', () => {
        let languageWise_URL_EndPoints = ['in', 'ae', 'ca'];

        languageWise_URL_EndPoints.forEach((urlEndPoint) => {
            cy.visit(`https://www.apple.com/${urlEndPoint}/`, {timeout: uiTimeout});

             cy.languageWiseStrings(urlEndPoint).then((textAsPerURLEndpoint) => {
                cy.get('a[data-analytics-title="choose your country"]')
                .scrollIntoView()
                .should('be.visible')
                .then(($ele) => {
                    cy.log('TEXT -> ', $ele.text().trim())
                    expect($ele.text().trim()).to.eq(textAsPerURLEndpoint)
                })
             });
        });
    });

});