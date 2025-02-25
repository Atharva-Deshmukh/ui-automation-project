/* 
cy.get('textarea').type('Hello world') // yields <textarea>
.type() yields the same subject it was given.

Mimic user typing behavior
Each keypress is delayed 10ms by default in order to simulate how a very fast 
user types!
cy.get('[contenteditable]').type('some text!')


# Cypress .type() Key Sequences

## **Key Sequences**
| Sequence        | Notes                                          |
|---------------|----------------------------------------------|
| `{{}`         | Types the literal `{` key                  |
| `{backspace}` | Deletes character to the left of the cursor |
| `{del}`       | Deletes character to the right of the cursor |
| `{downArrow}` | Moves cursor down                           |
| `{rightArrow}` | Moves cursor right                        |
| `{leftArrow}` | Moves cursor left                          |
| `{upArrow}`   | Moves cursor up                            |
| `{enter}`     | Types the Enter key                        |
| `{esc}`       | Types the Escape key                       |
| `{insert}`    | Inserts character to the right of the cursor |
| `{moveToEnd}` | Moves cursor to the end of the input       |
| `{end}`       | Moves cursor to the end of the line        |
| `{moveToStart}` | Moves cursor to the start of the input   |
| `{home}`      | Moves cursor to the start of the line      |
| `{pageDown}`  | Scrolls down                               |  FOR <textarea> that are large
| `{pageUp}`    | Scrolls up                                 |
| `{selectAll}` | Selects all text                           |

---

## **Modifier Key Sequences**
| Sequence  | Notes                                  |
|-----------|--------------------------------------|
| `{alt}`   | Activates the `altKey` modifier (`{option}` alias) |
| `{ctrl}`  | Activates the `ctrlKey` modifier (`{control}` alias) |
| `{meta}`  | Activates the `metaKey` modifier (`{command}`, `{cmd}` alias) |
| `{shift}` | Activates the `shiftKey` modifier  |

On Windows the META key is the Window (⊞) key.
On Mac machines the META key is the Cmd (⌘) key.

---

## **Options for `.type()`**
| Option                         | Default                   | Description |
|--------------------------------|--------------------------|------------|
| `delay`                        | `10` ms                   | Delay after each keypress. |
| `force`                        | `false`                   | Forces the action, disables waiting for actionability. |
| `parseSpecialCharSequences`    | `true`                    | Parse special characters `{esc}`, `{enter}`, etc. Set to `false` to type them literally. |
| `release`                      | `true`                    | Keep a modifier activated between commands. |
| `timeout`                      | `defaultCommandTimeout`   | Time to wait for `.type()` to resolve before timing out. |
| `waitForAnimations`            | `waitForAnimations`       | Whether to wait for elements to finish animating before executing the command. |


KEY COMBINATIONS

Same as a user holding down SHIFT and ALT, then pressing b
The modifiers are released before typing 'hello'
    cy.get('input').type('{shift+alt+b}hello')

When a modifier is specified on its own, it will remain activated for the duration of the 
.type() command, and is released when all subsequent characters are typed.

This is the same as a user holding down SHIFT and ALT, then typing 'hello'
The modifiers are held for the duration of the command.
    cy.get('input').type('{shift}{alt}hello')

all characters after {ctrl} will have 'ctrlKey' set to 'true' on their key events
    cy.get('input').type('{ctrl}test')

By default, modifiers are released after each type command.

To keep a modifier activated between commands, specify {release: false} in the options.
    cy.get('input').type('{alt}foo', { release: false }) // 'altKey' will be true while typing 'foo'
    cy.get('button').click() // 'altKey' will also be true during 'get' and 'click' commands



Modifiers are automatically released between tests, even with {release: false}.
    it('has modifiers activated', () => {
    // 'altKey' will be true while typing 'foo'
    cy.get('input').type('{alt}foo', { release: false })
    })

    it('does not have modifiers activated', () => {
    // 'altKey' will be false while typing 'bar'
    cy.get('input').type('bar')
    })

To manually release modifiers within a test after using {release: false}, use another type 
command and the modifier will be released after it.

    // 'altKey' will be true while typing 'foo'
    cy.get('input').type('{alt}foo', { release: false })
    // 'altKey' will be true during the 'get' and 'click' commands
    cy.get('button').click()
    // 'altKey' will be released after this command
    cy.get('input').type('{alt}')
    // 'altKey' will be false during the 'get' and 'click' commands
    cy.get('button').click()


Do a shift + click
    execute a SHIFT + click on the first <li> {release: false} is necessary so that
    SHIFT will not be released after the type command
    cy.get('body').type('{shift}', { release: false }).get('li:first').click()

Force typing regardless of its actionable state
    cy.get('input[type=text]').type('Test all the things', { force: true })


    it("Demonstrates key sequences", () => {
        cy.get("@inputField").type("Hello World!{backspace}{backspace}"); // Deletes last two chars
        cy.get("@inputField").type("{leftArrow}{leftArrow}{del}"); // Moves left and deletes
        cy.get("@inputField").type("{home}START-"); // Moves cursor to start and types
        cy.get("@inputField").type("{moveToEnd}-END"); // Moves to end and types
        cy.get("@inputField").type("{selectAll}{backspace}Cleared!"); // Selects all and replaces
    });

    it("Demonstrates type options", () => {
        cy.get("@inputField").type("Typing slowly...", { delay: 500 }); // Slow typing
        cy.get("@inputField").type("Forced typing!", { force: true }); // Ignores visibility checks
    });

*/

import { uiTimeout } from "../../fixtures/commonData";

describe('WORKFLOWS', () => {
/* DOM Used
    <input list="fruit" />
    <datalist id="fruit">
        <option>Apple</option>
        <option>Banana</option>
        <option>Cantaloupe</option>
    </datalist> */
    it('For "selecting" an option, just type it into the input.', () => {
        cy.visit('http://127.0.0.1:5500/DOMs/INPUTS_DOM.html', {timeout: uiTimeout})
        cy.get('input[list="fruit"]', {timeout: uiTimeout})
        .should('be.visible')
        .type("Banana");
    });

    it('Select all text, copy it on clipboard and verified', () => {
        /* DOM Used
        <textarea id="clipBoard">
            COPIED ON CLIOBOARD
        </textarea>*/
        

        // THIS MAY NOT ALWAYS WORK, use invoke() instead
        cy.visit('http://127.0.0.1:5500/DOMs/INPUTS_DOM.html', {timeout: uiTimeout});
        cy.get('#clipBoard', {timeout: uiTimeout})
        .should('be.visible')
        .type("{selectAll+ctrl+c}{ctrl+c}") // Ensure text is selected and copied, NO SPACE between ctrl and c
        .then(() => {  
            cy.window().then((win) => {
                win.navigator.clipboard.readText().then((txt) => {
                    console.warn('COPIED: ', txt)
                    expect(txt.trim()).to.eq('COPIED ON CLIOBOARD')
                })
            })
        });
    });

    it('parseSpecialCharSequences option', () => {
        /* DOM Used
        <textarea id="clipBoard">
            COPIED ON CLIOBOARD
        </textarea>*/
        

        cy.visit('http://127.0.0.1:5500/DOMs/INPUTS_DOM.html', {timeout: uiTimeout});
        cy.get('#clipBoard', {timeout: uiTimeout})
        .should('be.visible')
        .clear()
        .type("{selectAll+ctrl+c}{ctrl+c}", {parseSpecialCharSequences: false}) // Everything is typed literally
        // Typed {selectAll+ctrl+c}{ctrl+c}
    });

    it.only("UPPER CASE typing", () => {
        cy.visit('http://127.0.0.1:5500/DOMs/INPUTS_DOM.html', {timeout: uiTimeout});
        cy.get('#clipBoard', {timeout: uiTimeout})
        .should('be.visible')
        .as('inputField')

        cy.get("@inputField").type("{shift}HELLO"); // Shift for uppercase
    });
});