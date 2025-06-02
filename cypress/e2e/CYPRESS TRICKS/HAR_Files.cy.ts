/*
                                     What is HAR file
                                     ----------------
A HAR (HTTP Archive) file is a JSON-formatted log file that captures network traffic data, 
allows developers and QA engineers to capture detailed information about network requests 
made during the execution of Cypress tests.

                            How to generate .har file in cypress?
                            ------------------------------------

We have plugin for that: NeuraLegion/cypress-har-generator


                                    How to run .har file?
                                    ---------------------
Generate HAR file in cypress using plugin. Clear browser's network tab and drag and drop the file
there.
All requests recording will appear. */

describe('my tests', () => {
  before(() => {
    // start recording
    cy.recordHar();
  });

  after(() => {
    // save the HAR file
    cy.saveHar();
  });
});