/* We add Mochawesome reporter to the Cypress configuration file
   to generate HTML reports for our tests.

   Note that cypress each spec file in isolation, so the reports are generated
   for each spec file separately. If you want to generate a single report for all
   spec files, you can use the `merge` option provided by Mochawesome.

                                   Step 1: Installation
                              --------------------------------

         Installing some may give error with yarn especially on Windows. 
         So, use: --ignore-engines blob
         yarn add mochawesome-report-generator --ignore-engines

        1. Install Mocha
        npm install mocha --save-dev

        2. Install cypress-multi-reporters
        npm install cypress-multi-reporters --save-dev

        3. Install mochawesome
        npm install mochawesome --save-dev

        4. Install mochawesome-merge
        npm install mochawesome-merge --save-dev

        5. Install mochawesome-report-generator
        npm install mochawesome-report-generator --save-dev



                                 Step 2: Add reporter settings in cypress.config.ts file
                                 -------------------------------------------

"reporter": "cypress-multi-reporters",
    "reporterOptions": {
        "reporterEnabled": "mochawesome",
        "mochawesomeReporterOptions": {
            "reportDir": "cypress/reports/mocha",
            "quite": true,
            "overwrite": false,
            "html": false,
            "json": true
        }
    }

    Overall becomes:
        reporter: 'cypress-multi-reporters',
         screenshotsFolder: 'cypress/reports/mochareports/assets',
         screenshotOnRunFailure: true,  // to take screenshot on test failure
         videosFolder: 'cypress/videos',
         reporterOptions: {
            reporterEnabled: 'mochawesome',
            mochawesomeReporterOptions: {
            reportDir: 'cypress/reports/mocha',
            quite: true,  // to suppress console logs
            overwrite: false,  // to overwrite previous reports
            html: false, // to generate HTML ouput of test run
            json: true // to generate JSON ouput of test run
            }
         },

                              Step 3: Add scripts in package.json file
                              ---------------------------------------

For Windows -
"scripts": {
    "clean:reports": "if exist cypress\\reports rmdir /s/q cypress\\reports && mkdir cypress\\reports mkdir cypress\\reports\\mochareports",
    "pretest": "npm run clean:reports",
    "scripts": "cypress run",
    "combine-reports": "mochawesome-merge cypress/reports/mocha/*.json > cypress/reports/mochareports/report.json",
    "generate-report": "marge cypress/reports/mochareports/report.json -f report -o cypress/reports/mochareports",
    "posttest": "npm run combine-reports && npm run generate-report",
    "test" : "npm run scripts || npm run posttest"
  }
 
                  Step 4 - Add Screenshots of failed test cases to report
                  ---------------------------------------------------------

A. Change screenshot path into cypress.json
"screenshotsFolder": "cypress/reports/mochareports/assets",

B. Add the following code into cypress e2e.ts file (e.g., cypress/support/e2e.ts)

import addContext from "mochawesome/addContext";

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    const screenshot = `assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext({ test }, screenshot);
  }
});

-----------------------------------------
VIDEOS of failed test cases ONLY

       on('after:spec', (spec, results) => {
              if (config.video) {
                if (results.stats.failures || results.stats.skipped) {
                  console.log('SPEC FAILED OR SKIPPED, NOT DELETING VIDEO');
                } else {
                  console.log('Deleting video...');
                  const fs = require('fs');  /* Sometimes, global import don't work, hence separate import  */
                  fs.unlinkSync(results.video);
                }
              }
       });
 

*/