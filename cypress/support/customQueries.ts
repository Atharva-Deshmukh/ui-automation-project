Cypress.Commands.addQuery('getById', function (id: string) {
    Cypress.log({ name: 'getById', message: id });
  
    return () => {
      console.log('getById called with:', id);
  
      /* Use Cypress.$() to get the element, ensuring it works within Cypress' retry mechanism
      Uses Cypress' jQuery Wrapper (Cypress.$()) Instead of document.getElementById()

      Cypress.$() is aware of Cypress' automatic retries, while document.getElementById() is not.
      This ensures Cypress waits for the element without breaking its execution model.

       When the element is not found, we return an empty jQuery object (Cypress.$()), 
       which triggers Cypress' built-in retry logic. */

      const $element = Cypress.$(`#${id}`);
      console.warn('ELEMENT BY ID -> ', $element.length ? $element[0] : null);
  
      // If the element is not found, return an empty jQuery object so Cypress retries
      return $element.length ? $element : Cypress.$();
    };
  });
  

  Cypress.Commands.overwriteQuery('get', function (originalFn, ...args) {
    console.warn('PUTIN'); // Log "PUTIN" every time cy.get() is called
    return originalFn.apply(this, args); // Call the original cy.get() function
  });