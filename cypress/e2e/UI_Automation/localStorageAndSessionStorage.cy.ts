
/* NOTES:

Local Storage                                    | Session Storage                                  | Cookies
------------------------------------------------ | -----------------------------------------------  | --------------------------------------------
The storage capacity is 5MB/10MB                 | The storage capacity is 5MB                      | The storage capacity of Cookies is 4KB
As it is not session-based, it must be deleted vi| Cleared automatically when browser is closed     | Cookies expire based on the setting and work per tab and window
JavaScript or manually .                         |                                                  |
The client can read and write local storage      | The client can read and write session storage    | Both clients and servers can read and write the cookies
There is no transfer of data to the server       | There is no transfer of data to the server       | Data transfer to the server exists


getAllLocalStorage()
- Get localStorage data for all origins with which the test has interacted.
- cy.getAllLocalStorage() yields an object where the keys are origins and the values are key-value
  pairs of localStorage data.
  For example, if key1 is set to value1 on https://example.cypress.io and key2 is set to 
  // value2 on https://www.cypress-dx.com, cy.getAllLocalStorage() will yield:

        {
        'https://example.cypress.io': {
            key1: 'value1',
        },
        'https://www.cypress-dx.com': {
            key2: 'value2',
        },
        }

        cy.visit('https://example.cypress.io', {
            onBeforeLoad(win) {
                win.localStorage.setItem('key', 'value')
            },
        })

        cy.getAllLocalStorage().then((result) => {
            expect(result).to.deep.equal({
                'https://example.cypress.io': {
                key: 'value',
                },
            })
        })

clearLocalStorage()
- Clear data in localStorage for current domain and subdomain.
- argument is optional
- cy.clearLocalStorage('appName')

    cy.clearLocalStorage(/prop1|2/).then((ls) => {
    expect(ls.getItem('prop1')).to.be.null
    expect(ls.getItem('prop2')).to.be.null
    expect(ls.getItem('prop3')).to.eq('magenta')
    })
    
clearAllLocalStorage()
- Clear localStorage data for all origins with which the test has interacted.

clearAllSessionStorage()
- Clear sessionStorage data for all origins with which the test has interacted.
- cy.clearAllSessionStorage() yields null.

getAllSessionStorage()
- Get sessionStorage data for all origins with which the test has interacted.
- cy.getAllSessionStorage() yields an object where the keys are origins and the values are key-value 
  pairs of sessionStorage data.

    For example, if key1 is set to value1 on https://example.cypress.io and key2 is set to value2 
    // on https://www.cypress-dx.com, cy.getAllSessionStorage() will yield:

    {
    'https://example.cypress.io': {
        key1: 'value1',
    },
    'https://www.cypress-dx.com': {
        key2: 'value2',
    },
    } 


    ////////////////////////////////////////// TIP ///////////////////////////////////////

    U can use cy.wrap(localStorage).invoke('setItem', 'item')

*/