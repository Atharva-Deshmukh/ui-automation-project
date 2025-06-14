// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import "cypress-real-events";
import 'cypress-plugin-snapshots/commands';
import "cypress-failed-log";

import addContext from "mochawesome/addContext";

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    const screenshot = `assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext({ test }, screenshot);
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')

// DISABLING FOR NOW
// Cypress.Keyboard.defaults({
//     keystrokeDelay: 1000,
// });

const app = window.top;
if (!Cypress.env('SHOW_REQUEST_LOGS')) {  // Only hide logs when SHOW_REQUEST_LOGS is false or undefined
  if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
    const style = app.document.createElement("style");
    style.innerHTML = ".command-name-request, .command-name-xhr { display: none }";
    style.setAttribute("data-hide-command-log-request", "");
    app.document.head.appendChild(style);
  }
}

// Cypress.on('window:before:load', (winObj) => {
//   cy.stub(winObj.console, 'log').callsFake((msg) => {
//     cy.now('task', 'log', msg);
//     throw new Error(msg);
//   });
//   cy.stub(winObj.console, 'error').callsFake((msg) => {
//     cy.now('task', 'error', msg);
//     throw new Error(msg);
//   });
// });


/* NOTE:

  use console.log(), not cy.log()

  Cypress runs Cypress.on('uncaught:exception') outside of its test command queue, 
  so using cy.* commands like cy.log inside that block causes Cypress to crash or misbehave. 
  
  Also, cy.log() is asynchronous and Cypress.on() is synchronous */

Cypress.on('uncaught:exception', (err, runnable) => {
  console.warn('ERROR MESSAGE', err.message); // prevent test from failing
  return false;
});