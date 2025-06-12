import { defineConfig } from "cypress";
import fs from 'fs';
import xlsx from 'xlsx';
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    excludeSpecPattern: [
      "**/__snapshots__/*",
      "**/__image_snapshots__/*"
    ],
    chromeWebSecurity: false,
    scrollBehavior: false,  // to prevent cypress' default behaviour to scroll elements into focus

    /* numTestsKeptInMemory: 50 (default), --> making it 0 disables timetravel
       this also helps to log element yeild on console after clicking element */
    numTestsKeptInMemory: 50,

    // experimentalMemoryManagement: true,
    requestTimeout: 90000,
    supportFile: "cypress/support/e2e.ts",
    responseTimeout: 90000,
    defaultCommandTimeout: 40000,
    pageLoadTimeout: 120000,  // used for cy.visit()
    testIsolation: false,    // no logout after each it block and data is preserved across test suite
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false,
    slowTestThreshold: 180_000,
    setupNodeEvents(on, config) {
       initPlugin(on, config);
      // implement node event listeners here

      // Code to launch browser in icognito mode
      // on('before:browser:launch', (browser = {}, launchOptions) => {
      //   if(browser.family === 'chromium' || browser.name !== 'electron') {
      //     launchOptions.args.push('--incognito');
      //   }
      //   return launchOptions;
      // });

                                              // DEFINING TASKS HERE
      on('task', {
        noParam: noParam,
        singleParam: singleParam,
        multipleParams: multipleParams,
        readExcel: readExcel,
      });

      // WAY-2 of defining tasks
      // Cypress automatically merges on('task') objects.
      
      /* Defined outside defineConfig():

            const myTask = {
        readFileMaybe(filename) {
            if (fs.existsSync(filename)) {
              return fs.readFileSync(filename, 'utf8')
            }

            return null
          },
        }

        on('task', myTask)

      */

        

      

                                            // Function definitions
      function noParam() {
        return 'No Param';
      }

      function singleParam(paramPassed: number) {
        return paramPassed;
      }

      function multipleParams(inputObj) {
        return inputObj.Name + ' ' + inputObj.Age;
      }


      /* -------------------------Excel related Tasks---------------------------- */

      /**
       * Returns excel data as JSON array in both row wise format or column wise format
       *  filePath: The path to the Excel file.
       * sheetName: The name of the sheet from which you want to extract data.
       * returnType: Can be either 'column' or 'row' depending on whether you want to fetch column data or row data.
       * columnName: The name of the column to extract (when returnType is 'column').
       * Error Handling: The task handles cases where the column doesn’t exist and returns a custom error message. */

      function readExcel({ filePath, sheetName, returnType, columnName }) {
        try {
          const file = fs.readFileSync(filePath); // Read the file
          const workbook = xlsx.read(file, { type: 'buffer' }); // Parse the file

          const worksheet = workbook.Sheets[sheetName]; // Get the specific sheet
          const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON array (header: 1 to include headers)

          if (returnType === 'column') {
            const headerRow = jsonData[0]; // Get headers
            const columnIndex = (headerRow as any).indexOf(columnName); // Get column index

            if (columnIndex === -1) {
              throw new Error(`Column "${columnName}" not found`);
            }

            // Fetch the data for the specified column
            const columnData = jsonData.slice(1).map(row => row[columnIndex]);
            return columnData;

          } else if (returnType === 'row') {
            // Return the entire row-wise data (except header)
            return jsonData.slice(1);
          }
        } catch (err) {
          return { error: err.message };
        }
      }
    },
  },


env: {
  "cypress-plugin-snapshots": {
    "autoCleanUp": false,            // Automatically remove snapshots that are not used by test
    "autopassNewSnapshots": true,    // Automatically save & pass new/non-existing snapshots
    "diffLines": 3,                  // How many lines to include in the diff modal
    "excludeFields": [],             // Array of fieldnames that should be excluded from snapshot
    "ignoreExtraArrayItems": false,  // Ignore if there are extra array items in result
    "ignoreExtraFields": false,      // Ignore extra fields that are not in `snapshot`
    "normalizeJson": true,           // Alphabetically sort keys in JSON
    "prettier": true,                // Enable `prettier` for formatting HTML before comparison
    "imageConfig": {
      "createDiffImage": true,       // Should a "diff image" be created, can be disabled for performance
      "resizeDevicePixelRatio": true,// Resize image to base resolution when Cypress is running on high DPI screen, `cypress run` always runs on base resolution
      "threshold": 0.01,             // Amount in pixels or percentage before snapshot image is invalid
      "thresholdType": "percent"     // Can be either "pixels" or "percent"
    },
    "screenshotConfig": {            // See https://docs.cypress.io/api/commands/screenshot.html#Arguments
      "blackout": [],
      "capture": "fullPage",
      "clip": null,
      "disableTimersAndAnimations": true,
      "log": false,
      "scale": false,
      "timeout": 30000
    },
    "serverEnabled": true,           // Enable "update snapshot" server and button in diff modal
    "serverHost": "localhost",       // Hostname for "update snapshot server"
    "serverPort": 2121,              // Port number for  "update snapshot server"
    "updateSnapshots": false,        // Automatically update snapshots, useful if you have lots of changes
    "backgroundBlend": "difference"  // background-blend-mode for diff image, useful to switch to "overlay"
  }
}
});
