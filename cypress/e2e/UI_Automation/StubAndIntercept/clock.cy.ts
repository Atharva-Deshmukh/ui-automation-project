/* cy.clock() overrides native global functions related to time like
    setTimeout, clearTimeout, setInterval, clearInterval, Date Objects

The clock starts at the unix epoch (timestamp of 0) and date = January 1st, 1970.

                                                    YEILDs
                                                    ------

                    Either do clock = cy.clock()
                                   OR
You can also access the clock object via this.clock in a .then() callback.
cy.clock().then((clock) => {  // yields a clock object with following methods

    clock.tick(milliseconds)
    Move the clock the specified number of milliseconds. 

    clock.restore()
    Restore all overridden native functions. This is automatically called between tests,
    so should not generally be needed.

    clock.setSystemTime(now)
    Change the system time to the new now. Now can be a timestamp, date object, or not passed in which 
    defaults to 0. No timers will be called, nor will the time left before they trigger change.
})*/

import { uiTimeout } from "../../../fixtures/commonData";

describe('WORKFLOWS', () => {
    it('Without clock, spec run time is longer one', () => {
        let obj = {key: 'val'};

        function changeVal(obj) {
            setTimeout(() => {
                obj.key = 'VAL_UPDATED';
            }, 11000);
        }

        cy.wrap(changeVal(obj));

        cy.wrap(obj).should('have.own.property', 'key', 'VAL_UPDATED');  
        // test did run for 11 seconds literaly
    });

    /* DOM used:

        <button id="VAL">Click Me</button>

        <script>
            setTimeout(() => {
                let button = document.getElementById('VAL');
                if (button) {
                    button.innerText = 'Click Me UPDATED';
                }
            }, 10000); // 10 seconds
        </script> 
        
        In this DOM, the button text changes after 10 seconds, we fast-forewarded system time and 
        forced the button to change in 229 ms only. VERY USEFUL FOR SLOW UI ELEMENTS
        */

    it('Make the test Faster: With clock, we can modify the systems time and finish the spec in less time', () => {
        cy.clock(); // Freeze the clock

        cy.visit('http://127.0.0.1:5500/DOMs/CLOCK.html', {timeout: uiTimeout});

    
        cy.get('#VAL', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.text', 'Click Me');

        // Fast-foreward time
        cy.tick(11000).then(() => {
            cy.get('#VAL', {timeout: uiTimeout}).should('have.text', 'Click Me UPDATED'); 
            // Assertion should now pass immediately
        })
    
        cy.clock().invoke('restore'); // Restore the system clock
    });

    it('For native JS, use window obj', () => {
        let count = 0;

        cy.clock();

        cy.window().then((win) => {
            win.setInterval(() => {
                count++;
            }, 1000);
        });

        cy.tick(5000).then(() => {
            expect(count).to.equal(5);
        });

        // restore the clock
        cy.clock().then((clock) => {
            clock.restore();
        })
    });

    it.only('Specify a now timestamp', () => {
        const now = new Date(2021, 3, 14) // month is 0-indexed

        cy.clock(now)
        cy.visit('/')
        cy.get('#date').should('have.value', '04/14/2021')
    });
    
});