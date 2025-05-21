import { uiTimeout } from "../../fixtures/commonData";

describe('WORKFLOWS OF VARIOUS NAVIGATION FUNCTIONS', () => {

    it('siblings()', () => {
        /*  Get all siblings of the current element exlcuding the current element
        
        DOM USED:

        <ul>
          <li>apples</li>
          <li>oranges</li>
          <li>bananas</li>
          <li class="selected">pineapples</li>
          <li class="selected">Chillies</li>
          <li class="selected">grapes</li>
          <li>grapeVines</li>
        </ul>    */

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        cy.get('li:contains("bananas")', {timeout: uiTimeout})
        .should('be.visible')
        .siblings()
        .then(($ele) => {
          console.warn('ELE -> ', $ele);
        })
        .should('have.length', 6);

        // Get siblings of element with class selected
        cy.get('li:contains(bananas)', {timeout: uiTimeout})
        .should('be.visible')
        .siblings('.selected') 
        .should('have.length', 3);
        
    });
    it('next() and prev()', () => {
        /*  Get the immediately following sibling of each DOM element
        
        DOM USED:

        <ul>
          <li>apples</li>
          <li>oranges</li>
          <li>bananas</li>
          <li class="selected">pineapples</li>
          <li class="selected">Chillies</li>
          <li class="selected">grapes</li>
          <li>grapeVines</li>
        </ul>    */

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        cy.get('.selected:last', {timeout: uiTimeout})
        .should('be.visible')
        .next()
        .should('have.length', 1)
        .and('have.text', 'grapeVines');

        // when selector is passed in next()
        cy.get('li', {timeout: uiTimeout})
        .should('be.visible')
        .next('.selected') /* Finds the very next sibling of each li. Keep only the ones with a class selected */
        .should('have.length', 3);

        cy.get('li:contains("pineapples")', {timeout: uiTimeout})
        .should('be.visible')
        .prev()
        .should('have.length', 1)
        .and('have.text', 'bananas');

        cy.get('li:contains("grapeVines")', {timeout: uiTimeout})
        .should('be.visible')
        .prev('.selected')
        .should('have.length', 1);
        
    });

    it('nextAll() and prevAll()', () => {
        /*  Get all following siblings of each DOM element in a set of matched DOM elements.
        
        DOM USED:

        <ul>
          <li>apples</li>
          <li>oranges</li>
          <li>bananas</li>
          <li class="selected">pineapples</li>
          <li class="selected">Chillies</li>
          <li class="selected">grapes</li>
          <li>grapeVines</li>
        </ul>    */

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        cy.get('li:contains("pineapples")', {timeout: uiTimeout})
        .should('be.visible')
        .nextAll()
        .should('have.length', 3);

        cy.get('li:contains("grapeVines")', {timeout: uiTimeout})
        .should('be.visible')
        .nextAll()                 // undefined
        .should('have.length', 0);

        // when selector is passed in nextAll()
        cy.get('li', {timeout: uiTimeout})
        .should('be.visible')
        .next('.selected') /* Finds the very next sibling of each li. Keep only the ones with a class selected */
        .should('have.length', 3);

        cy.get('li:contains("grapeVines")', {timeout: uiTimeout})
        .should('be.visible')
        .prevAll()                 
        .should('have.length', 6);

        cy.get('li:contains("grapeVines")', {timeout: uiTimeout})
        .should('be.visible')
        .prevAll('.selected')                 
        .should('have.length', 3);
        
    });

    it('nextUntil(selector) and prevUntil(selector)', () => {
        /*  Get all following siblings of each DOM element in a set of matched DOM 
             elements up to, but not including, the element provided.

             It is always passed with selector
        
        DOM USED:

        <ul>
            <li id="fruits" class="header">Fruits</li>
            <li>apples</li>
            <li>oranges</li>
            <li>bananas</li>
            <li id="veggies" class="header">Vegetables</li>
            <li>cucumbers</li>
            <li>carrots</li>
            <li>corn</li>
            <li id="nuts" class="header">Nuts</li>
            <li>walnuts</li>
            <li>cashews</li>
            <li>almonds</li>
          </ul>    */

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        // Find all of the element's siblings following #veggies until #nuts
        cy.get('#veggies', {timeout: uiTimeout})
        .should('be.visible')
        .nextUntil('#nuts') 
        .should('have.length', 3);
        //returns [<li>cucumbers</li>, <li>carrots</li>, <li>corn</li>]

        cy.get('#veggies', {timeout: uiTimeout})
        .should('be.visible')
        .prevUntil('#fruits') 
        .should('have.length', 3);
        //returns [<li>Apples</li>, <li>oranges</li>, <li>bananas</li>]
        
    });

    it('childern()', () => {
        /*  Get all following siblings of each DOM element in a set of matched DOM 
             elements up to, but not including, the element provided.

             It is always passed with selector
        
        DOM USED:

        <ul>
          <li>About</li>
          <li>
            Services
            <ul class="secondary-nav">
              <li class="services-1">Web Design</li>
              <li class="services-2">Logo Design</li>
              <li class="services-3">
                Print Design
                <ul class="tertiary-nav">
                  <li>Signage</li>
                  <li>T-Shirt</li>
                  <li>Business Cards</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Contact</li>
        </ul>    
*/

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        cy.get('.secondary-nav', {timeout: uiTimeout})
        .should('be.visible')
        .children()
        .should('have.length', 3)
        .first()
        .should('have.text', 'Web Design');
        // yields [
        //  <li class="services-1">Web Design</li>,
        //  <li class="services-2">Logo Design</li>,
        //  <li class="services-3">Print Design</li>
        // ]

        cy.get('.secondary-nav', {timeout: uiTimeout})
        .should('be.visible')
        .children('.services-2')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Logo Design');
        //returns [<li class="services-2">Logo Design</li>]
        
    });

    it('parent() and parents() and parentsUntil()', () => {
        /*  .parent() only travels a single level up the DOM tree as opposed to the .parents() command.

        DONT PASS SELECTOR in parent(), it misbehaves

        parentsUntil() is always passed with a selector
        
        DOM USED:

              <ul class="secondary-nav">
                <li class="services-1">Web Design</li>
                <li class="services-2">Logo Design</li>
                <li class="services-3">
                  Print Design
                  <ul class="tertiary-nav">
                    <li>Signage</li>
                    <li>T-Shirt</li>
                    <li>Business Cards</li>
                  </ul>
                </li>
              </ul>
*/

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        // without selector
        cy.get('li:contains("Signage")', {timeout: uiTimeout})
        .should('be.visible')
        .parent()
        .should('have.class', 'tertiary-nav');
        
        // with selector - INCORRECT CODE
        // cy.get('li:contains("T-Shirt")', {timeout: uiTimeout})
        // .should('be.visible')
        // .parent('.tertiary-nav')
        // .should('be.visible')
        // .and('have.class', '.tertiary-nav');

        /* REASON:
        .parent('.tertiary-nav') is incorrect because .parent() selects the direct parent, 
        but <li>T-Shirt</li>'s direct parent is <ul class="tertiary-nav">, not .tertiary-nav itself.
        
        */

        // without selector
        cy.get('li:contains("Signage")', {timeout: uiTimeout})
        .should('be.visible')
        .parents()
        .should('be.visible')
        .and('have.length', 8);  // actual DOM is bigger than the one shown in comments

        // with selector
        cy.get('li:contains("Signage")', {timeout: uiTimeout})
        .should('be.visible')
        .parents('.secondary-nav')
        .should('be.visible')
        .and('have.length', 1);  

        // parentsUntil() - always with selector
        // Get all ancestors of each DOM element in a set of matched DOM elements up to, but not including, 
        // the element provided.

        // Misbehaves: keeps finding elements to the <html> node, hence use closest

        // cy.get('li:contains("Signage")', {timeout: uiTimeout})
        // .should('be.visible')
        // .parentsUntil('.services-3')
        // .should('be.visible')
        // .then(($ele) => {
        //   console.warn('ELE -> ', $ele)
        // })
        // .and('have.length', 2);    

    });

    it.only('closest()', () => {
        /*  Get the first DOM element that matches the selector (whether it be itself or one of its ancestors).
        
            Always passed with selector

        DOM USED:

              <ul class="secondary-nav">
                <li class="services-1">Web Design</li>
                <li class="services-2">Logo Design</li>
                <li class="services-3">
                  Print Design
                  <ul class="tertiary-nav">
                    <li>Signage</li>
                    <li>T-Shirt</li>
                    <li>Business Cards</li>
                  </ul>
                </li>
              </ul>
*/

        cy.visit('http://127.0.0.1:5500/DOMs/NavigationDOM.html', {timeout: uiTimeout});

        // with selector
        cy.get('li:contains("Signage")', {timeout: uiTimeout})
        .should('be.visible')
        .closest('ul.secondary-nav')
        .should('be.visible')
        .and('have.length', 1);
        
    });
});