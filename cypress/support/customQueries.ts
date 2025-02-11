Cypress.Commands.addQuery('getById', function (id: string) {
    Cypress.log({ name: 'getById', message: id });
  
    return () => {
      console.log('getById called with:', id);
  
      // Use Cypress.$() to get the element, ensuring it works within Cypress' retry mechanism
      const $element = Cypress.$(`#${id}`);
      console.warn('ELEMENT BY ID -> ', $element.length ? $element[0] : null);
  
      // If the element is not found, return an empty jQuery object so Cypress retries
      return $element.length ? $element : Cypress.$();
    };
  });
  