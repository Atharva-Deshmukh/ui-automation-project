/* 
cy.clock() overrides native global functions related to time allowing them to be controlled 
synchronously via cy.tick() or the yielded clock object. This includes controlling:
    setTimeout
    clearTimeout
    setInterval
    clearInterval
    Date Objects

The clock starts at the unix epoch (timestamp of 0). This means that when you instantiate new Date 
in your application, it will have a time of January 1st, 1970.

                                                    YEILD
cy.clock() yields a clock object with the following methods:

clock.tick(milliseconds)
Move the clock the specified number of milliseconds. Any timers within the affected 
range of time will be called.

clock.restore()
Restore all overridden native functions. This is automatically called between tests,
 so should not generally be needed.

clock.setSystemTime(now)
Change the system time to the new now. Now can be a timestamp, date object, or not passed in which 
defaults to 0. No timers will be called, nor will the time left before they trigger change.

You can also access the clock object via this.clock in a .then() callback.


                                        TRIGGERING a setInterval
// your app code
let seconds = 0

setInterval(() => {
  $('#seconds-elapsed').text(++seconds + ' seconds')
}, 1000)

cy.clock()
cy.visit('/index.html')
cy.tick(1000)
cy.get('#seconds-elapsed').should('have.text', '1 seconds')
cy.tick(1000)
cy.get('#seconds-elapsed').should('have.text', '2 seconds')




*/

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

        cy.wrap(obj).should('have.own.property', 'key', 'VAL_UPDATED');  // test did run for 11 seconds literaly
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

    it('With clock, we can modify the systems time and finish the spec in less time', () => {
        cy.clock(); // Freeze the clock

        cy.visit('http://127.0.0.1:5500/DOMs/CLOCK.html', {timeout: uiTimeout});

    
        cy.get('#VAL', {timeout: uiTimeout})
        .should('be.visible')
        .and('have.text', 'Click Me');

        // Fast-foreward time
        cy.tick(11000).then(() => {
            cy.get('#VAL', {timeout: uiTimeout}).should('have.text', 'Click Me UPDATED'); // Assertion should now pass immediately
        })
    
        cy.clock().invoke('restore'); // Restore the system clock
    });
    
});