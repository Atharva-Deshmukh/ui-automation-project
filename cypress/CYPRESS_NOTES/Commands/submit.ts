/*
The subject must be a <form>.

Correct Usage
cy.get('form').submit() // Submit a form

Incorrect Usage
cy.submit() // Errors, cannot be chained off 'cy'
cy.get('input').submit() // Errors, 'input' does not yield a form

Submit can only be called on a single form
<form id="contact">
  <input type="text" name="message" />
  <button type="submit">Send</button>
</form>

cy.get('#contact').submit()

.submit() is a helpful command used as a shortcut. Normally a user has to perform a different 
"action" to submit a form. It could be clicking a submit <button>, or pressing enter on a keyboard.

If you want the other guarantees of waiting for an element to become actionable, you should use a 
different command like .click() or .type().

*/