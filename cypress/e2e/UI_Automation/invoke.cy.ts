import { uiTimeout } from "../../fixtures/commonData";

/* NOTES:

- If you want to get a property that is not a function on the previously 
  yielded subject, use .its().
- .invoke() yields the return value of the method.
- .invoke() is a query, and it is safe to chain further commands.
-  If you chain additional commands off of .invoke(), the function will be called multiple times!
- .invoke() will wait for the function to exist on the subject before running.
- .invoke() will throw an error if the invoked function returns a promise. 
   If you want to invoke a function that returns a promise, use .then() instead.

NOTE:
- If you chain further commands off of .invoke(), it will be called multiple 
  times. If you only want the method to be called once, end your chain with 
  .invoke() and start fresh with cy afterwards.


                                    VARIOUS FUNCTIONS USED WITH INVOKE()
                                    ------------------------------------

1. DOM Manipulation Methods

                    Method         Description
                    ----------------------------------------------
                    .text()        Gets the inner text of an element
                    .html()        Gets or sets the HTML content of an element
                    .val()         Gets or sets the value of an input, textarea, or select
                    .css()         Gets or sets the CSS property of an element
                    .attr()        Gets or sets an attribute of an element
                    .removeAttr()  Removes an attribute from an element
                    .prop()        Gets or sets a property of an element
                    .addClass()    Adds a CSS class to an element
                    .removeClass() Removes a CSS class from an element
                    .toggleClass() Toggles a class on an element

2. Visibility & Dimensions

                    Method         Description
                    ----------------------------------------------
                    .show()        Makes an element visible
                    .hide()        Hides an element
                    .width()       Gets the width of an element
                    .height()      Gets the height of an element
                    .outerWidth()  Gets the outer width including padding and border
                    .outerHeight() Gets the outer height including padding and border
                    .position()    Gets the position of an element relative to its parent
                    .offset()      Gets the offset position of an element relative to the document

3. Attribute Handling

                    Method         Description
                    ----------------------------------------------
                    .hasClass()    Checks if an element has a certain class
                    .data()        Gets or sets data attributes on an element
                    .removeData()  Removes a data attribute from an element

4. Event Handling

                    Method         Description
                    ----------------------------------------------
                    .click()       Triggers a click event on an element
                    .focus()       Sets focus on an element
                    .blur()        Removes focus from an element
                    .trigger()     Triggers an event manually
*/

describe("jQuery Methods Test using invoke()", () => {
    before(() => {
        cy.visit("http://127.0.0.1:5500/DOMs/INVOKE.html", {timeout: uiTimeout});

        /* DOM USED:

        <div class="container">
            <h1 id="title">Hello, jQuery!</h1>
            <p id="content">This is a paragraph.</p>
            <input type="text" id="inputField" value="Initial Value">
            <button id="actionBtn">Click Me</button>
        </div>
        
        */
    });

    it.skip("Check if invoke waits for the function to return the value", () => {
        let val: string = 'Initial';
        let obj = {
            fnKey: function() {
                return val;
            }
        }

        // .invoke() will automatically retry until all chained assertions have passed.
        cy.wrap(obj).invoke('fnKey').should('equal', 'Final');

        setTimeout(() => {
            val = 'Final';
        }, 3000);
    });

    it.skip("Invoke function with arguments", () => {
        const fn = (a, b, c) => {
            return a + b + c
          }
          
          cy.wrap({ sum: fn })
            .invoke('sum', 2, 4, 6)
            .should('be.greaterThan', 10)
            .and('be.lessThan', 20);
    });

    it.skip("Invoke Array elements index-wise", () => {

        // cy.invoke also works on arrays and allows using numerical index to pick a function to run.
        let square = (n) => (n * n);
        let double = (n) => (2 * n);

        // picks function with index 1 and calls it with argument 4
        cy.wrap([square, double]).invoke(1, 4).should('equal', 8);
        cy.wrap([square, double]).invoke(0, 6).should('equal', 36);
    });

    it.skip(".text() - Get and Set Text Content", () => {

        cy.get("#title").invoke("text").then((txt) => {
            cy.log('TXT -> ', txt)  // gives text
        })

        cy.get("#title").invoke("text").should("eq", "Hello, jQuery!");
        cy.get("#title").invoke("text", "Updated Title").should("have.text", "Updated Title");
        // cy.reload();
        // cy.get("#title").invoke("text").should("eq", "Hello, jQuery!");

        /*
        In Cypress, .invoke() permanently changes the DOM during the test execution but does not 
        persist after a page reload because Cypress does not modify the actual HTML file; it only 
        manipulates the in-memory DOM of the browser session.
        */
    });

    it.skip(".html() - Get and Set HTML Content", () => {
        cy.get("#content").invoke("html").should("eq", "This is a paragraph.");
        cy.get("#content").invoke("html", "<strong>Updated HTML</strong>");
        cy.get("#content strong").should("exist").and('have.text', 'Updated HTML');
    });

    it.skip(".val() - Get and Set Input Value", () => {
        cy.get("#inputField").invoke('val').then(() => {
            cy.get("#inputField").should("have.value", "Initial Value");
        });
        cy.get("#inputField").invoke('val', 'UPDATED VAL').then(() => {
            cy.get("#inputField").should('have.value', 'UPDATED VAL');
        });
    });

    it.skip(".css() - Get and Set CSS Property", () => {
        cy.get("#title").should("have.css", "color");
        cy.get("#title").invoke("css", "color", "rgb(0, 0, 255)").then(() => {
            cy.get("#title").should("have.css", "color", "rgb(0, 0, 255)");
        })
    });

    it.skip(".attr() - Get and Set Attribute", () => {
        cy.get("#inputField").invoke("attr", "type").should("eq", "text");
        cy.get("#inputField").invoke("attr", "placeholder", "Enter text");
        cy.get("#inputField").should("have.attr", "placeholder", "Enter text");
    });

    it.skip(".removeAttr() - Remove Attribute \n .remove() - removes the full element", () => {
        cy.get("#inputField").invoke("attr", "placeholder", "Enter text");
        cy.get("#inputField").invoke("removeAttr", "placeholder");
        cy.get("#inputField").should("not.have.attr", "placeholder");

        // REMOVE THE FULL ELEMENT
        cy.get("#inputField").invoke("remove").then(() => {
            cy.get("#inputField").should('not.exist');
        });

        // Can also be used to remove local storage item
        // cy.window().its('localStorage').invoke('removeItem', 'session')
    });

    it.skip(".prop() - Get and Set Property", () => {
        cy.get("#inputField").invoke("prop", "readonly", true);
        cy.get("#inputField").should("have.prop", "readonly", true);
    });

    it.skip(".addClass() - Add CSS Class", () => {
        cy.get("#title").invoke("addClass", "highlight");
        cy.get("#title").should("have.class", "highlight");
    });

    it.skip(".removeClass() - Remove CSS Class", () => {
        cy.get("#title").invoke("addClass", "highlight");
        cy.get("#title").invoke("removeClass", "highlight");
        cy.get("#title").should("not.have.class", "highlight");
        cy.get('body div :not(.highlight)').should('have.length', 4);
    });

    it.skip(".toggleClass() - Toggle CSS Class", () => {
        cy.get("#title").invoke("toggleClass", "highlight");
        cy.get("#title").should("have.class", "highlight");  // added class and verified
        cy.get("#title").invoke("toggleClass", "highlight");
        cy.get("#title").should("not.have.class", "highlight"); // removed class and verified
    });


    // invoke(show) and invoke(hide) are common and no need to give them here
    // covering the rest

    it.skip(".width() and .height(): Gets actual width and heights of elements", () => {
        cy.get("#actionBtn").invoke("width").then((width) => {
            cy.log('WIDTH -> ', width);
        });
        cy.get("#actionBtn").invoke("height").then((height) => {
            cy.log('HEIGHT -> ', height);
        });

        // Change width and height: The above function just gets width and height, not change them
        // use CSS to change them
        cy.get("#actionBtn").invoke("css", "width", "500px");
        cy.get("#actionBtn").invoke("css", "height", "100px");

        cy.get("#actionBtn").invoke("width").then((width) => {
            cy.log('WIDTH -> ', width);
        });
        cy.get("#actionBtn").invoke("height").then((height) => {
            cy.log('HEIGHT -> ', height);
        });
    });

    it.skip(".outerWidth() and .outerHeight(): Gets the outer width and height including padding and border", () => {
        cy.get("#actionBtn").invoke("outerWidth").then((outerWidth) => {
            cy.log('outerWidth -> ', outerWidth);
        });
        cy.get("#actionBtn").invoke("outerHeight").then((outerHeight) => {
            cy.log('outerHeight -> ', outerHeight);
        });
    });

    it.skip(".position() - Gets the position of an element relative to its parent", () => {
        cy.get("#actionBtn").invoke("position").should((pos) => {
            expect(pos).to.have.property("top").and.to.be.closeTo(50, 1);
            expect(pos).to.have.property("left").and.to.be.closeTo(50, 1);
        });
    });

    it.skip(".offset() - Gets the offset position of an element relative to the document", () => {
        cy.get("#actionBtn").invoke("offset").should((offset) => {
            expect(offset).to.have.property("top").and.to.be.closeTo(50, 1);
            expect(offset).to.have.property("left").and.to.be.closeTo(50, 1);
        });
    });

    it.skip(".hasClass() - Checks if an element has a certain class", () => {
        cy.get("#divId").invoke('hasClass', 'container').should('be.true');
    });

    it.skip(".data() - Gets and sets data attributes on an element", () => {

        // DOM -> <button id="testButton-2" class="active" data-cy="CY DATA">Click Me</button>
        cy.get("#testButton-2").invoke("data", "cy").should("eq", "CY DATA");
        cy.get("#testButton-2").invoke("data", "cy", "Updated Data");
        cy.get("#testButton-2").invoke("data", "cy").should("eq", "Updated Data");
    });

    it.skip(".removeData() - Removes a data attribute from an element", () => {

        // DOM -> <button id="testButton" class="active" data-info="Sample Data">Click Me</button>
        // cy.get("#testButton").invoke("removeData", "info").then(() => {
        //     cy.get("#testButton").invoke("data", "info").should("be.undefined");
        // });

        /* The above code don't work:
        Query caches data() attributes internally after the first read.
        data-info="Sample Data" is stored in jQuery's internal data store.
        removeData("info") clears this cache but does not remove the original data-info attribute from the DOM.
        When .data("info") is called again, jQuery falls back to the original data-info attribute in the HTML.
        Since data-info="Sample Data" is still in the DOM, jQuery re-populates the cache with "Sample Data".
        
        Instead of .removeData(), use .removeAttr("data-info"):
        */

        cy.get("#testButton").invoke("removeAttr", "data-info");
        cy.get("#testButton").invoke("attr", "data-info").should("be.undefined");
    });
});
