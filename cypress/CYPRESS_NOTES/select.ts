/* Select an <option> within a <select>.


// Selecting single option and verifing
<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>

// yields <option value="456">apples</option>
cy.get('select').select('apples').should('have.value', '456')

---------------------------------------------------------------------
You can get the currently selected option using the jQuery's :selected selector.

<select id="name">
  <option>Joe</option>
  <option>Mary</option>
  <option selected="selected">Peter</option>
</select>

cy.get('select#name option:selected').should('have.text', 'Peter')

---------------------------------------------------------------------
// Selecting using index

<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>

// yields <option value="456">apples</option>
cy.get('select').select(0).should('have.value', '456')

---------------------------------------------------------------------
// selecting multiple options using value

<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>

cy.get('select')
  .select(['apples', 'bananas'])
  .invoke('val')
  .should('deep.equal', ['456', '458'])

---------------------------------------------------------------------
// selecting multiple options using index

<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>

cy.get('select')
  .select([0, 1])
  .invoke('val')
  .should('deep.equal', ['456', '457'])

  Note: Passing an array into cy.select() will select only the options matching values in the array, 
  leaving all other options unselected (even those that were previously selected). 
  In the same manner, calling cy.select([]) with an empty array will clear selections on all options.

  ---------------------------------------------------------------------
Force select a hidden <select>

<select style="display: none;">
  <optgroup label="Fruits">
    <option value="banana">Banana</option>
    <option value="apple">Apple</option>
  </optgroup>

  <optgroup></optgroup>
</select>

cy.get('select')
  .select('banana', { force: true })
  .invoke('val')
  .should('eq', 'banana')

  ---------------------------------------------------------------------
Force select a disabled <select>
Passing { force: true } to .select() will override the actionability checks for selecting a disabled <select>. 
However, it will not override the actionability checks for selecting a disabled <option> or an option within 
a disabled <optgroup>. See this issue for more detail.

<select disabled>
  <optgroup label="Veggies">
    <option value="okra">Okra</option>
    <option value="zucchini">Zucchini</option>
  </optgroup>

  <optgroup></optgroup>
</select>

cy.get('select')
  .select('okra', { force: true })
  .invoke('val')
  .should('eq', 'okra')
*/